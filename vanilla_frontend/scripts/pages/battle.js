document.addEventListener("DOMContentLoaded", () => {
  const socketUrl = "http://localhost:3000";
  const gameId = sessionStorage.getItem("gameId")
  const socket = new Socket(socketUrl, gameId)

  if (gameId) {
    socket.socket.emit("join-game", gameId)
  } else {
    console.error(`no game id found in local storage`)
  }
})

class Socket {
  socket;
  constructor(url, gameId) {
    this.socket = io(url);

    this.socket.on("game-start", (data) => {
      new Battle(data.note, this.socket, gameId)
    })
  }
}

class BattleElements {
  userScoreElement = document.getElementById("user-score")
  opponentScoreElement = document.getElementById("opponent-score")
  timerElement = document.getElementById("time-remaining");
  progressBarElement = document.querySelector("progress");
  mainContainerElement = document.querySelector('main');
  noteOnStaffElement = document.querySelector("img");
  keyElements = document.querySelectorAll("custom-key");
}

class Battle {
  socketConnection;
  currentNote;
  userScore = 0;
  opponentScore = 0;
  remainingTime = 10;
  remainingTimeIntervalId;
  gameId;
  battleElements = new BattleElements();
  NOTE_NAMES = {
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    G: "G",
    A: "A",
    B: "B"
  }
  
  WIN_STATUS = {
    WON: "YOU WON!",
    LOST: "YOU LOST!",
    DRAW: "IT'S A DRAW!"
  }

  constructor(note, socket, gameId) {
    this.gameId = gameId;
    this.socketConnection = socket;
    this.updateCurrentNote(note);
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
  }

  renderUserScore() {
    this.battleElements.userScoreElement.textContent = this.userScore;
  }

  renderProgressBarValue() {
    if (this.userScore <= 0 && this.opponentScore <= 0) {
      this.battleElements.progressBarElement.setAttribute("value", "0.5");
    } else {
      const progressBarValue = this.userScore / (this.userScore + this.opponentScore);
      this.battleElements.progressBarElement.setAttribute("value", String(progressBarValue))
    }
  }


  renderOpponentScore() {
    this.battleElements.opponentScoreElement.textContent = this.opponentScore;
  }

  setTimer() {
    this.remainingTimeIntervalId = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.endGame()
      }
      this.battleElements.timerElement.textContent = `${this.remainingTime}s`
    }, 1000)
  }

  async endGame() {
    const winStatus = 
      this.userScore > this.opponentScore ? 
      this.WIN_STATUS.WON :
      this.opponentScore > this.userScore ?
      this.WIN_STATUS.LOST :
      this.WIN_STATUS.DRAW

    clearInterval(this.remainingTimeIntervalId);

    this.battleElements.mainContainerElement.innerHTML = /*html*/`
    <h1>${winStatus}</h1>
    `

    await setTimeout(() => {
      window.location.replace("../waiting_room")
    }, 3000);
  }

  setEventListeners() {
    this.battleElements.keyElements.forEach((key) => {
      key.addEventListener("click", (e) => this.onNoteClick(e.target))
    })
  }

  onNoteClick(target) {
    const keyNote = target.getAttribute("noteName")
    if (keyNote == this.currentNote) {
      this.socketConnection.emit("correct-guess", this.gameId)
    }
  }

  updateCurrentNote(note) {
    this.currentNote = note;
    const imgLink = `../images/notes/${this.currentNote}_note.png`
    this.battleElements.noteOnStaffElement.setAttribute("src", imgLink)
  }
}