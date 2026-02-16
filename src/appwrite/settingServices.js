import { Client, Databases, Query } from "appwrite";
import conf from "../conf/conf";

export class SettingServices{
    client = new Client();
    databases;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.databases = new Databases(this.client);
    }

    async createSettings(userId){
        try {
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseID,
                conf.appwriteSettingsCollectionID,
                userId,
                {
                    theme: "light",
                    wallpaper: null,
                    fontsize: ""
                }
            )
           return response;
        } catch (error) {
            console.log("Appwrite service :: createSettings :: error", error.message)
        }
    }

    async getSettings(userId){
        try {
            const response = await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteSettingsCollectionID,
                userId
            );
            return response;
        } catch (error) {
            console.log("Appwrite service :: getSettings :: error", error.message)
        }
    }
    
    async updateSettings({userId, theme, wallpaper, fontsize}){
        try {
            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteSettingsCollectionID,
                userId,
                {
                    theme,
                    wallpaper,
                    fontsize
                }
            )
            return response;
        } catch (error) {
            console.log("Appwrite service :: updateSettings :: error", error.message)
        }
    }
}

const settingServices = new SettingServices();
export default settingServices;