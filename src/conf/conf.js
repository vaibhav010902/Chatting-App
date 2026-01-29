const conf = {
    appwriteURL: String(import.meta.env.VITE_APP_APPWRITE_URL),
    appwriteProjectID: String(import.meta.env.VITE_APP_PROJECT_ID),
    appwriteDatabaseID: String(import.meta.env.VITE_APP_DATABASE_ID),
    appwriteMessagesCollectionID: String(import.meta.env.VITE_APP_MESSAGES_COLLECTION_ID),
    appwriteUsersCollectionID: String(import.meta.env.VITE_APP_USERS_COLLECTION_ID),
    appwriteRelationshipCollectionID: String(import.meta.env.VITE_APP_RELATIONSHIP_COLLECTION_ID),
    appwriteBucketID: String(import.meta.env.VITE_APP_BUCKET_ID)
}

export default conf;