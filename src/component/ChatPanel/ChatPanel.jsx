import React, { useRef } from "react";
import styles from "./ChatPanel.module.css";
import MessageTile from "../MessageTile/MessageTile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveChat,
  loadLocalMessages,
  addMessage,
} from "../../store/chatSlice";
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

function ChatPanel({ currentChat,setCurrentChat, userProfile }) {
  // console.log("Inside Chat Panel Component....")
  const [emoji, setEmoji] = useState("");
  const [emojiVisibility, setEmojiVisibility] = useState(false);
  const fileRef = useRef();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  // const fileRef = useRef();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const userData = useSelector((state) => state.auth.userData);
  // console.log("Inside Chat Panel", userData, currentChat, userProfile);

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

  // const sendMessage = async () => {
  //   const isNotFriend = !userProfile.friends.some(
  //     (friend) => friend == currentChat?.$id
  //   );
  //   // CHECK IF THE CURRENT CHAT IS FRIEND OF CURRENT USER ON NOT
  //   if (isNotFriend) {
  //     const updatedFriends = [...userProfile.friends, currentChat?.$id];
  //     // PUSH CURRENT CHAT INTO THE FRIENDS ARRAY
  //     try {
  //       await profileServices.updateProfile({
  //         userId: userProfile.$id,
  //         first_name: userProfile.first_name,
  //         last_name: userProfile.last_name,
  //         email: userProfile.email,
  //         phone: userProfile.phone,
  //         dob: userProfile.dob,
  //         status: userProfile.status,
  //         profile: userProfile.profile_image,
  //         friends: updatedFriends,
  //         $createdAt: userProfile.$createdAt,
  //       });
  //     } catch (error) {
  //       console.error("Failed to update friends", error);
  //     }
  //   }
  //   // IF NOT -> UPDATE THE FIRENDS ARRAY OF CURRENT USER
  //   // const [mediaFiles,setMediaFiles] = useState([]);

  //   // if (imageFiles.length > 0) {
  //   //   const uploadAll = async () => {
  //   //     const uploads = imageFiles.map(({ fileID, file }) => ({
  //   //       id: fileID,
  //   //       media: storageServices.uploadFile({ fileID, file }),
  //   //     }));

  //   //     // const mediaUrl = await Promise.all({ uploads });
  //   //     const mediaUrl = await Promise.all(
  //   //       uploads.map(({ id, media }) =>
  //   //         media.then((res) => ({
  //   //           id,
  //   //           mediaUrl: media,
  //   //         }))
  //   //       )
  //   //     );
  //   //     console.log("Uploaded files:", mediaUrl);
  //   //     return;
  //   //   };
  //   //   uploadAll();
  //   // }
  //   let mediaFiles = [];
  //   if (imageFiles.length > 0) {
  //     const uploadAll = async () => {
  //       try {
  //         const mediaFiles = await Promise.all(
  //           imageFiles.map(async ({ fileID, file }) => {
  //             const uploaded = await storageServices.uploadFile({ fileID, file });
  //             console.log("Uploaded file:", uploaded);
  //             return {
  //               id: fileID,
  //               mediaUrl: uploaded,
  //             };
  //           })
  //         );
  //         console.log("Uploaded files:", mediaFiles);
  //         return;
  //       } catch (error) {
  //         console.error("Upload failed:", error);
  //       }
  //     };

  //     uploadAll();
  //     // return;
  //   }

  //   const message = {
  //     id: ID.unique(),
  //     chatId: currentChat?.$id,
  //     senderId: userData.$id,
  //     type: null,
  //     content: text == "" ? "" : text,
  //     mediaUrl: mediaFiles,
  //     createdAt: new Date().toISOString(),
  //     edited: false,
  //     deleted: false,
  //     conversationId: getConversationId(),
  //   };

  //   try {
  //     const response = await messagesService.sendMessage(message);
  //     if (!response) {
  //       console.log("Message Not Sent");
  //       return;
  //     }
  //   } catch (error) {
  //     console.log("Something went wrong! Unable to send your message");
  //   }

  //   setText("");
  // };

  // const getUser = async () =>{
  //   try {
  //     const session = await profileServices.getProfile("696a8a29000d0d95163a");
  //     if(session){
  //       console.log("User Found: ", session);
  //     }else{
  //       console.log("User Not Found");
  //     }
  //   } catch (error) {
  //     console.log("Something went wrong: ", error);
  //   }
  // }
  const sendMessage = async () => {
    // FRIEND CHECK
    const isNotFriend = !userProfile.friends.some(
      (friend) => friend === currentChat?.$id
    );

    if (isNotFriend) {
      try {
        await profileServices.updateProfile({
          userId: userProfile.$id,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          email: userProfile.email,
          phone: userProfile.phone,
          dob: userProfile.dob,
          status: userProfile.status,
          profile: userProfile.profile_image,
          friends: [...userProfile.friends, currentChat?.$id],
          $createdAt: userProfile.$createdAt,
        });
      } catch (error) {
        console.error("Failed to update friends", error);
      }
    }

    // UPLOAD MEDIA (WAIT HERE)
    let mediaFiles = [];

    if (imageFiles.length > 0) {
      try {
        mediaFiles = await Promise.all(
          imageFiles.map(async ({ fileID, file, fileUrl }) => {
            const uploaded = await storageServices.uploadFile({ fileID, file });
            URL.revokeObjectURL(fileUrl);
            return uploaded; // just the URL string
          })
        );
      } catch (error) {
        console.error("Upload failed:", error);
        return; // stop message sending if upload fails
      }
    }

    // CREATE MESSAGE (NOW mediaFiles IS READY ✅)
    const message = {
      id: ID.unique(),
      chatId: currentChat?.$id,
      senderId: userData.$id,
      type: null,
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
  };

  const getMessage = async () => {
    try {
      // const userId = userData.$id;
      const response = await messagesService.getMessages(getConversationId());
      setMessages(response.documents);
    } catch (error) {
      setMessages([]);
      console.log("Something went wrong: ", error);
    }
  };

  const deleteMessage = async (msgId) => {
    console.log("Delete Message",msgId);
    try {
      await messagesService.deleteMessage(msgId)
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  }

  const editMessage = (msgId, editText) => {
    console.log("Edit Message",msgId);
    console.log("Edit Message",editText);
  }



  useEffect(() => {
    if (!currentChat?.$id) return;
    getMessage();
  }, [currentChat?.$id]);

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
    setImageFiles((prev) => [...prev, ...mappedFiles]);

    e.target.value = null;    // FIX THE BUG (WHEN TRYING TO UPLOAD SAME NO. OF FILES RIGHT AFTER REMOVING THE PREVIOUS IMAGES FROM INPUT PREVIEW PANEL, IT DOESN'T GET UPLOADED...)
  };
  const handleRemoveFile = (fileID) => {
    const fileToRemove = imageFiles.find((file) => file.fileID === fileID);
    if (fileToRemove){
      URL.revokeObjectURL(fileToRemove.fileUrl);
    }
    const updatedFiles = imageFiles.filter((file) => file.fileID !==fileID);
    setImageFiles(updatedFiles);
    // setImageFiles((prev) =>
    //   prev.filter((file) => file.fileID !== fileID)
    // );
  }

  const startRecording = async () => {
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });    // ASKS BROWSER FOR MIC ACCESS
    console.log("micStream: ",micStream);
    setStream(micStream);    // SET THE STREAM
    setIsRecording(true);    // TRIGGER WAVEFORM RENDERING

    mediaRecorderRef.current = new MediaRecorder(micStream);
    audioChunksRef.current = [];
    mediaRecorderRef.current.start();    // START RECORDING
    console.log("mediaRecorderRef: ",mediaRecorderRef.current);

    mediaRecorderRef.current.ondataavailable = (e) =>    
      audioChunksRef.current.push(e.data);
      console.log("audioChunksRef.current", audioChunksRef.current)    // AUDIO COMES IN CHUNKS. WHEN RECORDING STOPS, WE GET ALL THE CHUNKS IN ONDATAAVAILABLE EVENT.
  };

  const stopRecording = async () => {
    setIsRecording(false);    // STOP WAVEFORM RENDERING
    stream.getTracks().forEach(track => track.stop());    // FREES MICROPHONE, PREVNETS "MIC STILL IN USE" BUG.
    mediaRecorderRef.current.stop();    // FINALIZE AUDIO FILE
    console.log(mediaRecorderRef)
    // mediaRecorderRef.current.stop();

    // mediaRecorderRef.current.onstop = async () => {
      // const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      // const file = new File([blob], "voice.webm");
      // setIsRecording(false);
      // stream.getTracks().forEach((track) => track.stop());
      // mediaRecorderRef.current.stop();
      // console.log("Audio File: ", stream);

      // const uploaded = await storageService.uploadFile(file);

      // await databaseService.sendMessage({
      //   chatId,
      //   senderId: userId,
      //   type: "voice",
      //   content: uploaded.$id,
      //   fileUrl: storageService.getFileView(uploaded.$id),
      // });
    // };
  };

  return (
    <div className={styles.chat_panel_container}>
      <div className={styles.chat_panel_header_container}>
        <div className={styles.chat_panel_header_container_1}>
          <span className="material-symbols-outlined" onClick={() => setCurrentChat("")}>arrow_back</span>
          <p>
            {currentChat?.$id
              ? currentChat.first_name + " " + currentChat.last_name
              : "No User Selected"}
          </p>
        </div>
        <div className={styles.chat_panel_header_btn_container}>
          <span className="material-symbols-outlined">call</span>
          <span className="material-symbols-outlined">video_call</span>
          <span className="material-symbols-outlined">more_vert</span>
        </div>
      </div>

      <div className={styles.chat_panel_main_container}>
        <ul className={styles.chats}>
          {messages?.map((msg) => (
            <MessageTile
              key={msg.$id}
              msgId={msg.$id}
              message={msg.content}
              mediaUrl={msg.mediaUrl}
              messanger={
                msg.senderId == currentChat.$id ? "sender" : "receiver"
              }
              deleteMessage={deleteMessage}
              editMessage={editMessage}
              time={msg.createdAt}
            />
          ))}
        </ul>
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
                  <span className="material-symbols-outlined" onClick={()=> handleRemoveFile(image.fileID)}>cancel</span>
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
          {text == "" && imageFiles.length == 0 ? (
            <>
              {isRecording && (
                <VoiceWaveform stream={stream} isRecording={isRecording} />
              )}
              <span
                className="material-symbols-outlined"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
              >
                mic
              </span>
            </>
          ) : (
            <span className="material-symbols-outlined" onClick={sendMessage}>
              send
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
// }
export default ChatPanel;
