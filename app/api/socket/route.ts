// pages/api/socket.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*", // ปรับตามความเหมาะสม
      },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  res.end();
}
