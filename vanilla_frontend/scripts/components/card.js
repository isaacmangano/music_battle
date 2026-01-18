const label = "label";
const requested = "requested";
const id = "id";

class Card extends HTMLElement {
  static observedAttributes = [label, requested, id];
  requestButton;
  socket = socket;
  constructor() {
    super();
    this.attachShadow({mode: "open"})
  }
  connectedCallback() {
    this.shadowRoot.innerHTML =    /*html*/`
    <link rel="stylesheet" href="../styles/globals.css">
    <link rel="stylesheet" href="../styles/components/card.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
      </style>
  
  <div class="card">
  <div class="user-details">
  <i class="fa fa-user fa-lg"></i>
  <h3>example@gmail.com 
  </h3>
  <span class="active">•</span>
  </div>
  <button>
  Request
  </button>
  </div>
  `
  // <a href="../battle">
  // </a>

  this.requestButton = this.shadowRoot.querySelector("button");
  console.log("request button:", this.requestButton)
  console.log("this.socket:", this.socket)

  this.updateLabel();
  this.setRequested();
  this.setButtonEventListener();
}

updateLabel() {
  const text = this.getAttribute(label);
      const labelNode = this.shadowRoot.querySelector("h3");
      labelNode.textContent = text;
}
setRequested() {
  const isRequested = this.getAttribute(requested);
  console.log({isRequested})
  if (isRequested) {
    const requestAnchorTag = this.shadowRoot.querySelector("a");
    requestAnchorTag.textContent = "Accept";
  }
}

setButtonEventListener() {
  this.requestButton.addEventListener("click", () => {
    console.log(`user id ${this.socket.id} has requested to battle ${this.getAttribute(label)}`);
    this.socket.emit("battle-requested", {
      opponent: this.getAttribute(label)
    })
  })
}
}

customElements.define('custom-card', Card);