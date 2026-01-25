import conf from "../conf/conf";
// import { Client, Realtime } from "appwrite";

// const client = new Client()
//   .setEndpoint(conf.appwriteURL)
//   .setProject(conf.appwriteProjectID);

// export const realtime = new Realtime(client);

import { Client, Databases, Realtime } from "appwrite";

const client = new Client()
  .setEndpoint(conf.appwriteURL)
  .setProject(conf.appwriteProjectID);

const databases = new Databases(client);
const realtime = new Realtime(client);

export { client, databases, realtime };
