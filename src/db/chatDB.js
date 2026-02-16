import { openDB } from "idb";

export const chatDB = openDB("chat-app-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("messages")) {
      const store = db.createObjectStore("messages", { KeyPath: "id" });
      store.createIndex("conversationId", "conversationId");
    }

    if (!db.objectStoreNames.contains("chats")) {
      db.createObjectStore("chats", { KeyPath: "id" });
    }
  },
});
