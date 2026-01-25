import { Client,Storage } from "appwrite";
import conf from "../conf/conf";

export class StorageServices {
    client = new Client();
    storage;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID)
        
        this.storage = new Storage(this.client)
    }


    async uploadFile({fileID,file}){
        try {
            const fileDetail = await this.storage.createFile(
                conf.appwriteBucketID,
                fileID,
                file
            )
            if(fileDetail){
                console.log("uploaded file: ",fileDetail)
                file = this.getFilePreview(fileDetail.$id)
                return file;
            }else{
                console.log("Error aa ga re bhaiya!!!")
            }
        } catch (error) {
            console.log("Appwrite Storage Service :: uploadFile :: error: ", error);
            throw error;
        }
    }

    async getFilePreview(fileID){
        try {
            const file = await this.storage.getFilePreview(
                conf.appwriteBucketID,
                fileID
            )
            if(file){
                console.log("File Preview: ",file)
                return file;
            }else{
                console.log("Error aa ga re bhaiya!!!")
            }
        } catch (error) {
            console.log("Appwrite Storage Service :: getFilePreview :: error: ", error);
            throw error;
        }
    }
}

const storageServices = new StorageServices();

export default storageServices;