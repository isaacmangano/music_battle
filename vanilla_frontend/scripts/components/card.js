const label = "label";
const requested = "requested"

class Card extends HTMLElement {
  static observedAttributes = [label, requested];
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
  <button><a href="../battle">Request</a></button>
  </div>
  `

  this.updateLabel();
  this.setRequested();
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
}

customElements.define('custom-card', Card);