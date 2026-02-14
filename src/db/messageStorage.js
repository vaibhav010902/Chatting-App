// import { chatDB } from "./chatDB";

// export async function saveMessages(messages) {
//   const db = await chatDB;
//   const tx = db.transaction("messages", "readwrite");
//   messages.forEach((msg) => tx.store.put(msg));
//   await tx.done;
// }

// export async function getMessagesByChat(conversationId) {
//   const db = await chatDB;
//   return db.getAllFromIndex("messages", "conversationId", conversationId);
// }

// export async function clearMessages(conversationId) {
//   const db = await chatDB;
//   const tx = db.transaction("messages", "readwrite");
//   const index = tx.store.index("conversationId");

//   for await (const cursor of index.iterate(conversationId)) {
//     cursor.delete();
//   }

//   await tx.done;
// }
