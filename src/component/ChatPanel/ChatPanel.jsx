import React, { useRef } from "react";
import styles from "./ChatPanel.module.css";
import MessageTile from "../MessageTile/MessageTile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setActiveChat, loadLocalMessages, addMessage} from "../../store/chatSlice";
import messagesService from "../../appwrite/messagesService";
import { ID } from "appwrite";
import conf from "../../conf/conf";
import { realtime } from "../../appwrite/config";
import profileServices from "../../appwrite/profileServices";
import { client } from "../../appwrite/config";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import storageServices from "../../appwrite/storage";
import VoiceWaveform from "../VoiceWaveform";
import { generateWaveform } from "../utils/generateWaveform";
import relationshipServices from "../../appwrite/relationshipServices";
import { resetUnreadByUser } from "../../store/messageStatusSlice";
import { updateProfile } from "../../store/userProfileSlice";


function ChatPanel({ currentChat, setCurrentChat}) {
  const [emojiVisibility, setEmojiVisibility] = useState(false);
  const fileRef = useRef();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [previewWaveform, setPreviewWaveform] = useState(null);
  const cancelRecordingRef = useRef(false);

  const userData = useSelector((state) => state.auth.userData);
  const [micVisibility, setMicVisibility] = useState(true);
  const [micStopVisibility, setMicStopVisibility] = useState(false);
  const [recordingCancelVisibility, setRecordingCancelVisibility] = useState(false);
  const [sendBtnVisibility, setSendBtnVisibility] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const chatRef = useRef(null);
  const dispatch = useDispatch();
  const [hamburgerMenuVisibility, setHamburgerMenuVisibility] = useState(false);
  const userProfile = useSelector(state => state.userprofile.userProfile);
  const userSettings = useSelector(state => state.settings)
  console.log(userSettings)

  // const dispatch = useDispatch();
  // const messages = useSelector((state) => state.chat.messages);

  //   useEffect(() => {
  //     dispatch(setActiveChat(getConversationId()));
  //     dispatch(loadLocalMessages(getConversationId()));
  //   }, [currentChat]);

  //   const sendMessage = async (text) => {
  //     const message = {
  //       id: crypto.randomUUID(),
  //       chatId,
  //       senderId: "currentUserId",
  //       content: text,
  //       createdAt: new Date().toISOString(),
  //     };

  //     dispatch(addMessage(message));

  const getConversationId = () => {
    return [userData.$id, currentChat?.$id].sort().join("-");
  };

  const sendMessage = async () => {
    setMicVisibility(true);
    setMicStopVisibility(false);
    setRecordingCancelVisibility(false);
    setSendBtnVisibility(false);
    handleCancelRecordingBtnClick();
    // FRIEND CHECK
    const isNotFriend = !userProfile.friends.some(
      (friend) => friend === currentChat?.$id
    );

    if (isNotFriend) {
      const requestByOther = await relationshipServices.relationshipType({
        fromUserId: userData.$id,
        toUserId: currentChat.$id,
      });
      const requestByUser = await relationshipServices.relationshipType({
        fromUserId: currentChat.$id,
        toUserId: userData.$id,
      });

      if (requestByUser.length == 0 && requestByOther.length == 0) {
        console.log("New Contact");
        const response = await profileServices.updateProfile({
          userId: userProfile.$id,
          friends: [...new Set([...userProfile.friends, currentChat.$id])],
        });
        dispatch(updateProfile(response))
        await relationshipServices.friendRequest({
          relationshipId: ID.unique() + Date.now(),
          fromUserId: userProfile.$id,
          toUserId: currentChat.$id,
        });
      } else if (requestByOther[0].status == "pending") {
        console.log("Friend Request Accept");
        await relationshipServices.friendRequestAccept(requestByOther[0].$id);
        const response = await profileServices.updateProfile({
          userId: userProfile.$id,
          friends: [...new Set([...userProfile.friends, currentChat.$id])],
        });
        dispatch(updateProfile(response))
      }
    }
    // UPLOAD MEDIA (WAIT HERE)
    let mediaFiles = [];
    let msgType = null;

    if (imageFiles.length > 0) {
      try {
        mediaFiles = await Promise.all(
          imageFiles.map(async ({ fileID, file, fileUrl }) => {
            const uploaded = await storageServices.uploadFile({ fileID, file });
            URL.revokeObjectURL(fileUrl);
            msgType = "image";
            return uploaded; // just the URL string
          })
        );
      } catch (error) {
        console.error("Upload failed:", error);
        return; // stop message sending if upload fails
      }
    }

    if (previewFile) {
      const fileID = ID.unique();
      let uploaded = await storageServices.uploadFile({
        fileID,
        file: previewFile,
      });
      uploaded = uploaded.replace("preview", "view");
      msgType = "voice";
      mediaFiles.push(uploaded);
      sendPreview();
    }

    // CREATE MESSAGE (NOW mediaFiles IS READY ✅)
    const message = {
      id: ID.unique(),
      chatId: currentChat?.$id,
      senderId: userData.$id,
      type:
        msgType == "voice" ? "voice" : msgType == "image" ? "image" : "text",
      content: text || "",
      mediaUrl: mediaFiles,
      createdAt: new Date().toISOString(),
      edited: false,
      deleted: false,
      conversationId: getConversationId(),
    };

    // SEND MESSAGE
    try {
      const response = await messagesService.sendMessage(message);
    } catch (error) {
      console.log("Something went wrong! Unable to send your message");
    }

    // RESET UI
    setText("");
    setImageFiles([]);
    msgType = "";
  };

  const getMessage = async () => {
    try {
      const response = await messagesService.getMessages(getConversationId());
      // console.log("Messages: ", response);
      setMessages(response.documents);
    } catch (error) {
      setMessages([]);
      console.log("Something went wrong: ", error);
    }
  };

  const deleteMessage = async (msgId) => {
    console.log("Delete Message", msgId);
    try {
      await messagesService.deleteMessage(msgId);
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  };

  const editMessage = (msgId, editText) => {
    console.log("Edit Message", msgId);
    console.log("Edit Message", editText);
  };

  useEffect(() => {
    if (!currentChat?.$id) return;
    getMessage();
  }, [currentChat?.$id]);

  useEffect(() => {
    if (!currentChat.$id) return;

    const markSeen = async () => {
      const response = await messagesService.getMessagesSendByUser({
        activeChatId: currentChat.$id, 
        userId: userProfile.$id
      })
      response.forEach(async (msg) => {
        await messagesService.updateMessageStatus({
          msgId: msg.$id,
          status: "seen"
        })
      })
      dispatch(resetUnreadByUser(currentChat.$id));
    };
    markSeen();
  }, [messages, currentChat.$id]);


  useEffect(() => {
    if (!currentChat?.$id) return;
    const channel = `databases.${conf.appwriteDatabaseID}.collections.${conf.appwriteMessagesCollectionID}.documents`;
    const unsubscribe = client.subscribe(channel, (response) => {
      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        setMessages((prev) => [...prev, response.payload]);
      }
    });
    return () => {
      unsubscribe(); // ✅ always a function
    };
  }, [currentChat?.$id]);

  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const mappedFiles = files.map((file) => ({
      fileID: ID.unique(),
      file,
      fileUrl: URL.createObjectURL(file),
    }));
    console.log(mappedFiles[0].fileUrl)
    setImageFiles((prev) => [...prev, ...mappedFiles]);

    e.target.value = null; // FIX THE BUG (WHEN TRYING TO UPLOAD SAME NO. OF FILES RIGHT AFTER REMOVING THE PREVIOUS IMAGES FROM INPUT PREVIEW PANEL, IT DOESN'T GET UPLOADED...)
  };
  const handleRemoveFile = (fileID) => {
    const fileToRemove = imageFiles.find((file) => file.fileID === fileID);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.fileUrl);
    }
    const updatedFiles = imageFiles.filter((file) => file.fileID !== fileID);
    setImageFiles(updatedFiles);
  };

  const handleMicBtnClick = () => {
    startRecording();
    setMicVisibility(false);
    setSendBtnVisibility(false);
    setMicStopVisibility(true);
    setRecordingCancelVisibility(true);
    return;
  };

  const handleStopRecordingBtnClick = () => {
    stopRecording();
    setSendBtnVisibility(true);
    setMicVisibility(false);
    setMicStopVisibility(false);
    return;
  };

  const handleCancelRecordingBtnClick = () => {
    if (isRecording) {
      cancelRecordingRef.current = true;
      stopRecording();
    }
    cancelPreview();
    setRecordingCancelVisibility(false);
    setSendBtnVisibility(false);
    setMicStopVisibility(false);
    setMicVisibility(true);
    return;
  };

  useEffect(() => {
    if (text.length > 0 || imageFiles.length > 0) {
      setSendBtnVisibility(true);
      setMicVisibility(false);
    } else {
      setSendBtnVisibility(false);
      setMicVisibility(true);
    }
  }, [text, imageFiles]);

  const startRecording = async () => {
    if (mediaRecorderRef.current?.state === "recording") return;

    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setStream(micStream);
    setIsRecording(true);

    mediaRecorderRef.current = new MediaRecorder(micStream, {
      mimeType: "audio/webm",
    });

    audioChunksRef.current = [];
    mediaRecorderRef.current.start(1000);

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    setIsRecording(false);

    mediaRecorderRef.current.onstop = async () => {
      if (cancelRecordingRef.current) {
        cancelRecordingRef.current = false;
        audioChunksRef.current = [];
        return;
      }
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const file = new File([blob], "voice.webm", { type: "audio/webm" });

      const waveform = await generateWaveform(blob);

      setPreviewFile(file);
      setPreviewType("voice");
      setPreviewWaveform(waveform);

      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    };

    mediaRecorderRef.current.stop();
  };

  const sendPreview = async () => {
    setPreviewFile(null);
    setPreviewType(null);
    setPreviewWaveform(null);
  };

  const cancelPreview = () => {
    setPreviewFile(null);
    setPreviewType(null);
    setPreviewWaveform(null);
  };

  useEffect(() => {
    if (!previewFile) return;
    const url = URL.createObjectURL(previewFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [previewFile]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.chat_panel_container} 
          style={{backgroundImage: userSettings?.chatWallpaper && `url(${userSettings?.chatWallpaper})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
          }}
    >
      <div className={styles.chat_panel_header_container}>
        <div className={styles.chat_panel_header_container_1}>
          <span
            className="material-symbols-outlined"
            onClick={() => setCurrentChat("")}
          >
            arrow_back
          </span>
          <p>
            {currentChat?.$id
              ? currentChat.first_name + " " + currentChat.last_name
              : "No User Selected"}
          </p>
        </div>
        <div className={styles.chat_panel_header_btn_container}>
          <span className="material-symbols-outlined">call</span>
          <span className="material-symbols-outlined">video_call</span>
          <span className="material-symbols-outlined" onClick={() => setHamburgerMenuVisibility(prev => !prev)}>more_vert</span>
          {hamburgerMenuVisibility && 
            <div className={styles.hamburger_menu_panel}>
              <p>Profile</p>
              <p>Archived</p>
              <p>Unfriend</p>
              <p>New Group</p>
              <p>Settings</p>
              <p>Block</p>
            </div>}
        </div>
      </div>

      <div className={styles.chat_panel_main_container} ref={chatRef} >
        <ul className={styles.chats}>
          {messages?.map((msg) => (
            <MessageTile
              key={msg.$id}
              msgId={msg.$id}
              message={msg.content}
              type={msg.type}
              mediaUrl={msg.mediaUrl}
              messanger={
                msg.senderId == currentChat.$id ? "sender" : "receiver"
              }
              deleteMessage={deleteMessage}
              editMessage={editMessage}
              // msgStatus={msg.status}
              time={msg.createdAt.slice(11, 16)}
            />
          ))}
        </ul>
        {/* <div ref={messagesEndRef} /> */}
      </div>

      <div className={styles.chat_input_container}>
        <div className={styles.chat_input_main_container}>
          <input
            type="file"
            multiple
            hidden
            ref={fileRef}
            onChange={(e) => handleFile(e)}
          />
          <span
            className="material-symbols-outlined"
            onClick={() => fileRef.current.click()}
          >
            add
          </span>
          {imageFiles.length > 0 && (
            <span className={styles.input_image_panel}>
              {imageFiles.map((image) => (
                <span key={image.fileID}>
                  <span
                    className="material-symbols-outlined"
                    onClick={() => handleRemoveFile(image.fileID)}
                  >
                    cancel
                  </span>
                  <img
                    src={image.fileUrl}
                    alt="Preview Not Available"
                    style={{
                      width: "80px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "0px",
                      // backgroundColor: "grey",
                      zIndex: "5",
                      opacity: "0.5",
                    }}
                  />
                </span>
              ))}
            </span>
          )}

          <span
            className="material-symbols-outlined"
            style={{ position: "relative" }}
            onClick={() => setEmojiVisibility((prev) => !prev)}
          >
            sticker{" "}
          </span>
          {emojiVisibility && (
            <span className={styles.emoji_panel}>
              <Picker
                data={data}
                onEmojiSelect={(e) => setText((prev) => prev + e.native)}
              />
            </span>
          )}
          <input
            type="text"
            placeholder="Enter Your Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {isRecording && (
            <VoiceWaveform
              stream={stream}
              isRecording={isRecording}
              style={{ border: "1px solid black" }}
            />
          )}

          {previewFile && (
            <audio
              controls
              src={previewUrl}
              style={{
                border: "1px solid black",
                height: "35px",
                borderRadius: "20px",
                padding: "0px 10px",
                backgroundColor: "#f5f5f5",
              }}
            />
          )}

          {micVisibility && (
            <span
              className="material-symbols-outlined"
              onClick={handleMicBtnClick}
            >
              mic
            </span>
          )}
          {micStopVisibility && (
            <span
              className="material-symbols-outlined"
              onClick={handleStopRecordingBtnClick}
              style={{ color: "#c60e0e", fontWeight: "400" }}
            >
              stop
            </span>
          )}
          {recordingCancelVisibility && (
            <span
              className="material-symbols-outlined"
              onClick={handleCancelRecordingBtnClick}
              style={{ color: "#c60e0e", fontWeight: "400" }}
            >
              cancel
            </span>
          )}
          {sendBtnVisibility && (
            <span className="material-symbols-outlined" onClick={sendMessage}>
              send
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
