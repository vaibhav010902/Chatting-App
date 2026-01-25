import {Client, Account, ID} from 'appwrite'
import conf from '../conf/conf'

export class AuthServices{
    client = new Client();
    account;
    constructor(){
        this.client
            .setEndpoint(conf.appwriteURL)
            .setProject(conf.appwriteProjectID);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, first_name, last_name}){
        try {
            console.log("Inside :: createAccount")
            const userData = await this.account.create(ID.unique(), email, password, first_name + " " + last_name);
            if(userData){
                const session = await this.loginAccount({email, password});
                return session;
                // return userData
            }else{
                return false;
            }

        } catch (error) {
            console.log("Appwrite AuthService Error: Signup: Error: ",error);
            throw error;
        }
    }

    async loginAccount({email, password}){
        try {
            const userData = await this.account.createEmailPasswordSession(email, password);
            if(userData){
                return userData;
            }else{
                console.log("User data NOT FOUND!!!!")
                return true;
            }
        } catch (error) {
            console.log("Appwrite AuthService Error: Login: Error: ",error)
            throw error;
        }
    }

    async getCurrentUser(){
        try {
            const user = await this.account.get()
            if(user){
                return user
            }else{
                console.log("No active session found. Redirecting to login.");
                return false;
            }
        } catch (error) {
            console.log("Appwrite AuthService Error :: getCurrentUser :: Error: ",error)
        }
    }

    async logoutAccount(){
        try {
            await this.account.deleteSessions()
            console.log("Logout Successfully")
            return true;
        } catch (error) {
            console.log("Appwrite AuthService Error :: logoutAccount :: Error: ",error)
            throw error;
        }
    }

}

const authServices = new AuthServices();

export default authServices;