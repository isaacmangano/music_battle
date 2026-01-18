import express from "express"
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const NOTE_NAMES = {
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  A: "A",
  B: "B"
}

const NOTE_NAMES_ARRAY = [
  NOTE_NAMES.C, 
  NOTE_NAMES.D, 
  NOTE_NAMES.E, 
  NOTE_NAMES.F, 
  NOTE_NAMES.G,
  NOTE_NAMES.A,
  NOTE_NAMES.B
]

const getRandomNote = () => NOTE_NAMES_ARRAY[Math.round(Math.random() * 6)]

type User = {
  id: string
}

type BattleDetails ={
  opponent: string
}

type Game = {
  id: string
}

const onlineUsers: User[] = []
const currentGames: Game[] = []

try {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
    }
  })



  io.on("connection", (socket: Socket) => {
    console.log(`socket with id -> ${socket.id}, just connected`);
    onlineUsers.push({id: socket.id})
    console.log("online users after connect", onlineUsers)
    io.emit("player_online", onlineUsers)

    socket.on("battle-requested", (battleDetails: BattleDetails) => {
      const {opponent} = battleDetails;
      const gameId = "testGameId";
      currentGames.push({id: gameId})
      console.log(`${socket.id} requested to battle ${opponent}`)
      io.sockets.to([socket.id, opponent]).emit("battle-initiated", gameId)
    })

    socket.on("join-game", (gameId:string) => {
      socket.join(gameId);
      const membersInRoom = io.sockets.adapter.rooms.get(gameId);
      console.log({membersInRoom})
      if (membersInRoom?.size == 2) {
        // send game start event to rom with starting note
        io.to(gameId).emit("game-start", {note: getRandomNote()})
      }
    })

    socket.on("correct-guess", (gameId) => {
      io.to(gameId).emit("new-note", {
        note: getRandomNote(),
        scorer: socket.id
      })
    })


    socket.on("disconnect", (reason) => {
      console.log(`disconnect reason: ${reason}`)
      const disconnectedUserId = onlineUsers.findIndex(({id}) => id === socket.id)
      onlineUsers.splice(disconnectedUserId, 1)
      console.log("online users after disconnect", onlineUsers)
      io.emit("player_disconnected", onlineUsers)
    })
  })
  
  httpServer.listen(3000);
  console.log(`listening to websockets server on port 3000`)
} catch (e: any) {
  console.error(`unable to listen to web scket server at port 3000`)
}
  

// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';

// const db = drizzle(process.env.DATABASE_URL!);

// const app = express()
// const PORT = 3000;

// app.listen(PORT, (error: Error | undefined) => {
//   if (!error) {
//     console.log(`app listening at port ${PORT}`)
//   } else {
//     console.error(`failed to connect to server at port ${PORT}`)
//   }
// })
