const KEY_COLOUR = "keyColour"
const NOTE_NAME = "noteName"
class Key extends HTMLElement {
  static observedAttributes = [KEY_COLOUR, NOTE_NAME];
  constructor() {
    super();
    this.attachShadow({mode: "open"})
  }
  connectedCallback() {
    this
    .shadowRoot
    .innerHTML =    /*html*/`
  <link rel="stylesheet" href="../styles/globals.css">
  <link rel="stylesheet" href="../styles/components/key.css">
  <script>
    @import url("../styles/globals.css")
    @import url("../styles/components/key.css")
  </script>
      <div class="key">
      <h2></h2>
      </div>
      `
      this.updateClassName();
      this.updateNoteName();
    }

    updateClassName() {
      const keyColour = this.getAttribute(KEY_COLOUR);
      const key = 
      this.shadowRoot
      // document
      .querySelector(".key");
      console.log({key})
      key.classList.add(`${keyColour}-key`);
    }

    updateNoteName() {
      const noteName = this.getAttribute(NOTE_NAME);
      if (noteName) {
        const label = 
        this.shadowRoot
        // document
        .querySelector("h2");
        label.textContent = noteName;
      }
    }
  }
  
  customElements.define('custom-key', Key);