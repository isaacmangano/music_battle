//TODO: make an env variable
const socket = io("http://localhost:3000");

// TODO: make a base Socket class and extend for waiting room and battle
socket.on("connect", () => {
  console.log(`my socket id is -> ${socket.id}`)
  mySocketId = socket.id
})

socket.on("disconnect", () => {
  console.log(`socket with id -> ${socket.id} has disconnected`)
})

socket.on("player_online", (users) => {
  waitingRoom.renderOnlineUsers(users);
})

socket.on("player_disconnected", (users) => {
  waitingRoom.renderOnlineUsers(users);
})

socket.on("battle-initiated", (gameId) => {
  sessionStorage.setItem("gameId", gameId);
  location.href = "../battle"
})

class WaitingRoom {
  incomingUsers;
  onlineUsers;
  incomingUsersContainer;
  outgoingUsersContainer;
  
  constructor() {
    this.incomingUsersContainer = document.querySelector(".incoming-users-container");
    this.outgoingUsersContainer = document.querySelector(".outgoing-users-container");
  }

  renderOnlineUsers(users) {
    this.onlineUsers = users;
    this.outgoingUsersContainer.innerHTML = ""
    this.onlineUsers
    .map(user => {
      if (user.id == mySocketId) {
        return;
      }
      const onlineUser = document.createElement("custom-card");
      onlineUser.setAttribute("label", user.id)
      this.outgoingUsersContainer.appendChild(onlineUser)
      }
    )
  }
}

const waitingRoom = new WaitingRoom();