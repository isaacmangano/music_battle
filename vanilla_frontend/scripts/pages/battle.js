const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(`my socket id is -> ${socket.id}`)
})

socket.on("disconnect", () => {
})


socket.on("game-start", (data) => {
  console.log(`game started with note ${data.note}`)
  new Battle(data.note)
})

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

const WIN_STATUS = {
  WON: "YOU WON!",
  LOST: "YOU LOST!",
  DRAW: "IT'S A DRAW!"
}
let gameId;
document.addEventListener("DOMContentLoaded", () => {
  gameId = sessionStorage.getItem("gameId")
  console.log({gameId})
  if (gameId) {
    socket.emit("join-game", gameId)
  } else {
    console.error(`no game id found in local storage`)
  }
})

class Battle {
  socketConnection = socket;
  currentNote;
  userScore = 0;
  opponentScore = 0;
  userScoreElement = document.getElementById("user-score")
  opponentScoreElement = document.getElementById("opponent-score")
  timerElement = document.getElementById("time-remaining");
  progressBarElement = document.querySelector("progress");
  mainContainerElement = document.querySelector('main');
  noteOnStaffElement = document.querySelector("img");
  remainingTime = 10;
  remainingTimeIntervalId;
  constructor(note) {
    // this.currentNote = note
    this.updateCurrentNote(note)
    console.log(this.currentNote)
    this.setTimer();
    this.renderUserScore();
    this.renderOpponentScore();
    this.renderProgressBarValue();
    this.setEventListeners();
    this.socketConnection.on("new-note", (data) => {
      this.updateCurrentNote(data.note);

     if (data.scorer == this.socketConnection.id) {

       this.userScore++;
       this.renderUserScore()
      } else {
        this.opponentScore++;
        this.renderOpponentScore();
      } 
      this.renderProgressBarValue();
    })
    console.log("current note in constructor", this.currentNote)
  }
  renderNoteOnStaff(note) {

    
  }

  renderUserScore() {
    this.userScoreElement.textContent = this.userScore;
  }

  renderProgressBarValue() {
    if (this.userScore <= 0 && this.opponentScore <= 0) {
      this.progressBarElement.setAttribute("value", "0.5");
    } else {
      const progressBarValue = this.userScore / (this.userScore + this.opponentScore);
      this.progressBarElement.setAttribute("value", String(progressBarValue))
    }
  }


  renderOpponentScore() {
    this.opponentScoreElement.textContent = this.opponentScore;
  }

  setTimer() {
    this.remainingTimeIntervalId = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.endGame()
      }
      this.timerElement.textContent = `${this.remainingTime}s`
    }, 1000)
  }

  async endGame() {
    const winStatus = this.userScore > this.opponentScore ? 
    WIN_STATUS.WON :
    this.opponentScore > this.userScore ?
    WIN_STATUS.LOST :
    WIN_STATUS.DRAW
    console.log({winStatus})
    clearInterval(this.remainingTimeIntervalId);
    this.mainContainerElement.innerHTML = /*html*/`
    <h1>${winStatus}</h1>
    `
    await setTimeout(() => {
      window.location.replace("../waiting_room")
    }, 3000);
  }

  setEventListeners() {
    const keys = document.querySelectorAll("custom-key");
    keys.forEach((key) => {
      key.addEventListener("click", (e) => this.onNoteClick(e.target))
    })
    console.log({keys})
  }

  onNoteClick(target) {
    const keyNote = target.getAttribute("noteName")
    console.log({keyNote}, "current note:", this.currentNote)
    if (keyNote == this.currentNote) {
      console.log("correct guess case")
      this.socketConnection.emit("correct-guess", gameId)
      console.log("current note:", this.currentNote)
    }
  }

  updateCurrentNote(note) {
  this.currentNote = note;
  let imgLink;
    switch (note) {
      case NOTE_NAMES.C:
        imgLink = "../images/notes/C_note.png";
        break;
      case NOTE_NAMES.D:
        imgLink = "../images/notes/D_note.png";
        break;
      case NOTE_NAMES.E:
        imgLink = "../images/notes/E_note.png";
        break;
      case NOTE_NAMES.F:
        imgLink = "../images/notes/F_note.png";
        break;
      case NOTE_NAMES.G:
        imgLink = "../images/notes/G_note.png";
        break;
      case NOTE_NAMES.A:
        imgLink = "../images/notes/A_note.png";
        break;
      case NOTE_NAMES.B:
        imgLink = "../images/notes/B_note.png";
        break;
    }
    // temp check
    // imgLink = "https://placehold.co/600x400"
    this.noteOnStaffElement.setAttribute("src", imgLink)
  }
}