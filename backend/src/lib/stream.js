import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

let chatClient;
let streamClient;

if (!apiKey || !apiSecret) {
  console.warn("STREAM_API_KEY or STREAM_API_SECRET is missing - using mock Stream clients");

  const createMockChannel = (type, id, data = {}) => ({
    create: async () => {
      console.log("[MOCK] Stream chat channel would be created:", { type, id, data });
    },
    addMembers: async (members) => {
      console.log("[MOCK] Stream chat members would be added:", { type, id, members });
    },
    delete: async () => {
      console.log("[MOCK] Stream chat channel would be deleted:", { type, id });
    },
  });

  const createMockCall = (type, id) => ({
    getOrCreate: async (options) => {
      console.log("[MOCK] Stream video call would be created:", { type, id, options });
    },
    delete: async (options) => {
      console.log("[MOCK] Stream video call would be deleted:", { type, id, options });
    },
  });

  chatClient = {
    createToken: (userId) => `mock_token_${userId}`,
    channel: (type, id, data) => createMockChannel(type, id, data),
    upsertUser: async (userData) => {
      console.log("[MOCK] Stream user would be upserted:", userData);
    },
    deleteUser: async (userId) => {
      console.log("[MOCK] Stream user would be deleted:", userId);
    },
  };

  streamClient = {
    video: {
      call: (type, id) => createMockCall(type, id),
    },
  };
} else {
  chatClient = StreamChat.getInstance(apiKey, apiSecret);
  streamClient = new StreamClient(apiKey, apiSecret);
}

export { chatClient, streamClient };

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream user upserted successfully:", userData);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully:", userId);
  } catch (error) {
    console.error("Error deleting the Stream user:", error);
  }
};
