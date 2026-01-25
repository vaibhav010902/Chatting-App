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
                    conversationId
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
                    // Query.or([
                    //     Query.and([
                    //         Query.equal("chatId", chatId),
                    //         Query.equal("senderId", userId)
                    //     ]),
                    //     Query.and([
                    //         Query.equal("chatId", userId),
                    //         Query.equal("senderId", chatId)
                    //     ])
                    // ])
                    Query.equal("conversationId", conversationId)
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
}

const messagesService = new MessagesService();

export default messagesService;