import conf from "../conf/conf";
import { Client, Databases, Query } from "appwrite";

export class MessagesService{
    client = new Client();
    databases;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.databases = new Databases(this.client);
    }

    async sendMessage({id, chatId, senderId, type, content, mediaUrl, createdAt, edited, deleted, conversationId}){
        try {
            await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteMessagesCollectionID,
                id,
                {
                    chatId,
                    senderId,
                    type,
                    content,
                    mediaUrl,
                    createdAt,
                    edited,
                    deleted,
                    conversationId,
                    status: "delivered"
                }
            )
        } catch (error) {
            console.log("Appwrite Messages Service :: sendMessage :: error: ", error);
            throw error;
        }
    }

    async getMessages(conversationId){
        try {
            const messages = await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteMessagesCollectionID,
                [
                    Query.orderAsc("createdAt"),
                    Query.equal("conversationId", conversationId),
                    Query.limit(100)
                    // Query.equal("chatId", chatId),
                    // Query.equal("senderId",userId)
                ]
            )
            if(messages){
                return messages;
            }else{
                return false;
            }
        } catch (error) {
            console.log("Appwrite Messages Service :: getMessages :: error: ", error);
            throw error;
        }
    }

    async deleteMessage(msgId){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseID,
                conf.appwriteMessagesCollectionID,
                msgId
            )
            console.log("Message deleted successfully");
        } catch (error) {
            console.log("Appwrite Messages Service :: deleteMessage :: error: ", error);
            throw error;
        }
    }

    async editMessage(msgId, content){
        try {
            await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteMessagesCollectionID,
                msgId,
                {
                    content
                }
            )
        } catch (error) {
            console.log("Appwrite Messages Service :: editMessage :: error: ", error);
            throw error;
        }
    }

    async getMessagesStatus({recieverId, status }){
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteMessagesCollectionID,
                [
                    Query.equal("chatId", recieverId),
                    Query.equal("status", status)
                ]
            )
            // console.log("Appwrite Messages Service :: getMessageStatus :: response: ", response.documents);
            return response.documents;
        } catch (error) {
            console.log("Appwrite Messages Service :: getMessageStatus :: error: ", error);
        }
    }

    async updateMessageStatus({msgId,status}){
        try {
            await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteMessagesCollectionID,
                msgId,
                {
                    status: status
                }
            )
        }catch(error){
            console.log("Appwrite Messages Service :: updateMessageStatus :: error: ", error);
        }
    }

    async getMessagesSendByUser({activeChatId, userId}){
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteMessagesCollectionID,
                [
                    Query.equal("chatId", userId),
                    Query.equal("senderId", activeChatId),
                    Query.notEqual("status", "seen")
                ]
            )
            // console.log("Appwrite Messages Service :: getMessagesSendByUser :: response: ", response.documents);
            return response.documents;
        } catch (error) {
            console.log("Appwrite Messages Service :: getMessagesSendByUser :: error: ", error);
        }
    }
}

const messagesService = new MessagesService();

export default messagesService;