import { Client, Databases, ID, Query } from "appwrite";
import conf from "../conf/conf";

export class RelationshipServices{
    client = new Client();
    database;

    constructor(){
        this.client
           .setEndpoint(import.meta.env.VITE_APP_APPWRITE_URL)
           .setProject(import.meta.env.VITE_APP_PROJECT_ID)
        this.database = new Databases(this.client)
    }

    async friendRequest({relationshipId,fromUserId, toUserId}){
        try {
            await this.database.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteRelationshipCollectionID,
                relationshipId,
                {
                    fromUserId,
                    toUserId,
                    status: "pending",
                    type: "friend",
                    $createdAt: Date.now()
                }
            )
            console.log("Friend Request Sent Successfully!")
        } catch (error) {
            console.log("Appwrite service :: friend request :: error", error)
        }
    }

    async friendRequestAccept(relationshipId){
        try {
            await this.database.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteRelationshipCollectionID,
                relationshipId,
                {
                    status: "accepted"
                }
            )
        } catch (error) {
            console.log("Appwrite service :: friend request accept :: error", error)
        }
    }

    async friendRequestReject({relationshipId,fromUserId, toUserId}){
        try {
            await this.database.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteRelationshipCollectionID,
                relationshipId,
                {
                    status: "rejected"
                }
            )
        } catch (error) {
            console.log("Appwrite service :: friend request reject :: error", error)
        }
    }

    async blockUser({relationshipId,fromUserId, toUserId}){
        try {
            await this.database.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteRelationshipCollectionID,
                relationshipId,
                {
                    type: "blocked",
                    status: "rejected"
                }
            )
            console.log("User Blocked Successfully!")
        } catch (error) {
            console.log("Appwrite service :: block user :: error", error)
        }
    }

    async relationshipType({fromUserId, toUserId}){
        try {
            const response = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteRelationshipCollectionID,
                [
                    Query.equal("fromUserId",toUserId),
                    Query.equal("toUserId",fromUserId)
                ]
            )
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: relationship type :: error", error)
        }
    }
    async getRelationshipList({toUserId,status}){
        try {
            const response = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteRelationshipCollectionID,
                [
                    Query.equal("toUserId",toUserId),
                    Query.equal("status",status)
                ]
            )
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: get request list :: error", error)
        }
    }

    async getRelationshipId({fromUserId,toUserId}){
        try {
            const response = await this.database.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteRelationshipCollectionID,
                [
                    Query.or([
                        Query.and([
                          Query.equal("fromUserId", fromUserId),
                          Query.equal("toUserId", toUserId),
                        ]),
                        Query.and([
                          Query.equal("fromUserId", toUserId),
                          Query.equal("toUserId", fromUserId),
                        ]),
                    ])
                ]
            )
            return response.documents[0].$id
        } catch (error) {
            console.log("Appwrite service :: Update Relationship :: error", error)
        }
    }

    async updateRelationship(relationshipId){
        try {
            await this.database.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteRelationshipCollectionID,
                relationshipId,
                {
                    archived: true
                }
            )
            console.log("Contact Archived Succesfully!!!")
        } catch (error) {
            console.log("Appwrite service :: get request list :: error", error)
        }
    }

}

const relationshipServices = new RelationshipServices();

export default relationshipServices;