// <div class="white-key"></div>
// <div class="white-key"></div>
// <div class="white-key"></div>
// <div class="white-key"></div>
// <div class="white-key"></div>
// <div class="white-key"></div>
// <div class="white-key"></div>

// <div class="black-key"></div>
// <div class="black-key"></div>
// <div class="black-key"></div>
// <div class="black-key"></div>
// <div class="black-key"></div>
// <div class="black-key"></div>
// <div class="black-key"></div>

class Keyboard extends HTMLElement {
  constructor() {
    super();
    // this.attachShadow({mode: "open"})
  }
  connectedCallback() {
    this
    // .shadowRoot
    .innerHTML =    /*html*/`
  <link rel="stylesheet" href="../styles/globals.css">
  <link rel="stylesheet" href="../styles/components/keyboard.css">
  <script type="module" src="../scripts/components/key.js"></script>
      <div class="white-key-container">
      <custom-key keyColour="white" noteName="C"></custom-key>
      <custom-key keyColour="white" noteName="D"></custom-key>
      <custom-key keyColour="white" noteName="E"></custom-key>
      <custom-key keyColour="white" noteName="F"></custom-key>
      <custom-key keyColour="white" noteName="G"></custom-key>
      <custom-key keyColour="white" noteName="A"></custom-key>
      <custom-key keyColour="white" noteName="B"></custom-key>
      </div>
      <div class="black-key-container">
      <custom-key keyColour="black"></custom-key>
      <custom-key keyColour="black"></custom-key>
      <custom-key keyColour="black"></custom-key>
      <custom-key keyColour="black"></custom-key>
      <custom-key keyColour="black"></custom-key>
      <custom-key keyColour="black"></custom-key>
      <custom-key keyColour="black"></custom-key>
      </div>
      
      `

}
}

customElements.define('custom-keyboard', Keyboard);