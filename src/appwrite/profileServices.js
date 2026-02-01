import conf from '../conf/conf'
import { Client, Databases, Query } from 'appwrite'

export class ProfileServices{
    client = new Client();
    databases;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.databases = new Databases(this.client);
    }

    async getProfile(userId){
        try {
            const userData = await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                [
                    Query.equal("$id", userId)
                ]
            )
            if(userData){
                return userData;
            }else{
                return false;
            }
        } catch (error) {
            console.log("Appwrite Profile Service :: getProfile :: error: ", error);
            throw error;
        }
    }
    async getAllUsers(){
        try {
            const userData = await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                [Query.orderAsc("$createdAt")]
            )
            if(userData){
                return userData;
            }else{
                return false;
            }
        } catch (error) {
            console.log("Appwrite Profile Service :: getAllUsers :: error: ", error);
            throw error;
        }
    }

    async setProfile({userId, first_name, last_name, email, phone, dob, status, profile_image}){
        // console.log("Reached setProfile in profileServices.js")
        try {
            // console.log("Inside try of setProfile")
            const userData = await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                userId,
                {
                    first_name,
                    last_name,
                    email,
                    phone,
                    dob,
                    profile_image,
                    status,
                    $createdAt: Date.now(),
                    $updatedAt: Date.now()
                }
            )
            if(userData){
                // console.log("Successfully Profile created", userData)
                return userData;
            }else{
                console.log("Failed to create Profile", error);
                return false;
            }
        } catch (error) {
            console.log("Appwrite Profile Service :: setProfile :: error: ", error);
            throw error;
        }
    }

    async updateProfile({userId, first_name, last_name, email, phone, dob, status, profile_image,friends,archived,favourites, $createdAt}){
        try {
            const session = await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteUsersCollectionID,
                userId,
                {
                    first_name,
                    last_name,
                    email,
                    phone,
                    dob,
                    profile_image,
                    status,
                    friends,
                    archived,
                    favourites,
                    $createdAt,
                    $updatedAt: Date.now()
                }
            )
            if(session){
                return session;
            }
        } catch (error) {
            console.log("Appwrite Profile Service :: setProfile :: error: ", error);
            throw error;
        }
    }
}

const profileServices = new ProfileServices();

export default profileServices;