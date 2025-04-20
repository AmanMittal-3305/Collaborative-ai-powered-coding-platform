import socket from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
  socketInstance = socket(import.meta.env.VITE_API_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });

  // Add connection and error logs
  socketInstance.on("connect", () => {
    console.log("Socket connected:", socketInstance.id);
  });

  socketInstance.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socketInstance;
};

// In socket.js (Client-side)
export const receiveMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);
};



export const sendMessage = (eventName, data) => {
  socketInstance.emit(eventName, data);
};
