import 'dotenv/config';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import Notes from "./Notes.ts"
import type {BattleDetails} from "./types.ts"

export default class SocketService {
  io;
  httpServer;
  PORT;
  onlineUsers: any[] = [];
  notes = new Notes();
  constructor(expressApp: any, PORT: number) {
    this.PORT = PORT;
    this.httpServer = createServer(expressApp);
    this.io = new Server(this.httpServer, {
      cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
      }
    })
    this.setupConnection();
  }
  
  setupConnection() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`socket with id -> ${socket.id}, just connected`);
      this.onlineUsers.push({id: socket.id})
      console.log("online users after connect", this.onlineUsers)
      this.io.emit("player_online", this.onlineUsers)
  
      socket.on("battle-requested", (battleDetails: BattleDetails) => {
        const {opponent} = battleDetails;
        const gameId = "testGameId";
        // currentGames.push({id: gameId})
        console.log(`${socket.id} requested to battle ${opponent}`)
        this.io.sockets.to([socket.id, opponent]).emit("battle-initiated", gameId)
      })
  
      socket.on("join-game", (gameId:string) => {
        socket.join(gameId);
        const membersInRoom = this.io.sockets.adapter.rooms.get(gameId);
        console.log({membersInRoom})
        if (membersInRoom?.size == 2) {
          // send game start event to rom with starting note
          this.io.to(gameId).emit("game-start", {note: this.notes.getRandomNote()})
        }
      })
  
      socket.on("correct-guess", (gameId) => {
        this.io.to(gameId).emit("new-note", {
          note: this.notes.getRandomNote(),
          scorer: socket.id
        })
      })
  
  
      socket.on("disconnect", (reason) => {
        console.log(`disconnect reason: ${reason}`)
        const disconnectedUserId = this.onlineUsers.findIndex(({id}) => id === socket.id)
        this.onlineUsers.splice(disconnectedUserId, 1)
        console.log("online users after disconnect", this.onlineUsers)
        this.io.emit("player_disconnected", this.onlineUsers)
      })
    })

  }


  listen() {
    this.httpServer.listen(this.PORT);
    console.log(`listening to websockets server on port 3000`)
  }
}