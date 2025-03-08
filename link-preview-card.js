/**
 * Copyright 2025 PlayGamesMakeGames
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 * 
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.link = ""; //https://www.youtube.com/watch?v=tKR_l79txOU
    this.jsonTitle = "";
    this.jsonDesc = "";
    this.jsonImg = "";
    this.jsonLink = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      link: { type: String, Reflect},
      jsonTitle: { type: String },
      jsonDesc: { type: String },
      jsonImg: { type: String },
      jsonLink: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--link-preview-card-label-font-size, var(--ddd-font-size-s));
      }
      .textField{
        display: flex;
        width: 512px;
        height: 128px;
        /* margin: var(--ddd-spacing-x(16)); */
      }
      /* card is invis when invalid link is pasted, not invis when valid link pasted */
      .card{
        display: inline-block;
        opacity: 1;
        pointer-events: all;
      }
      .cardInvis{
        opacity: 0;
        pointer-events: none;
      }
    `];
  }

  //fetch JSON of link and update variables we're looking for with info if it exists
  async getData(link) {
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json.data);
      // document.querySelector('#here').innerHTML = JSON.stringify(json.data, null, 2); //dont think I need this line
      //gets first title/desc/img/url related word - json.data[Object.keys(json.data).filter(key => key.toLowerCase().includes("title"))[0]];
      this.jsonTitle = json.data[Object.keys(json.data).filter(key => key.toLowerCase().includes("title"))[0]]; 
      this.jsonDesc = json.data[Object.keys(json.data).filter(key => key.toLowerCase().includes("description"))[0]];
      this.jsonImg = json.data[Object.keys(json.data).filter(key => key.toLowerCase().includes("image"))[0]];
      this.jsonLink = json.data[Object.keys(json.data).filter(key => key.toLowerCase().includes("url"))[0]];
      console.log(this.jsonTitle);
      console.log(this.jsonDesc);
      console.log(this.jsonImg);
      console.log(this.jsonLink);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  //updates this.link when a paste event occurs in the text field
  updateLink(event){
    this.jsonTitle = "";
    this.jsonDesc = "";
    this.jsonImg = "";
    this.jsonLink = "";
    this.link = event.clipboardData.getData("text");
    console.log(this.link);
    //tried doing the card creation here but couldn't get bool to update slow enough to wait for async func to be done
    // const successRetrieval = false;
    // this.getData(this.link).then((result) => {
    //   successRetrieval = result
    //   if(successRetrieval == true)
    //     {
    //       console.log("success retrieval");
    //     }
    //     else
    //     {
    //       console.log("failed retrieval");
    //     }
    //     console.log(this.link);});
  }

  isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (error) {
      return false;
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    //if link changes (on paste - updateLink() called) this gets called, check link is valid, and enable card in textarea
    if (changedProperties.has('link')) {
      this.getData(this.link);
      console.log("gotdata from new link");
      //check if new link valid
      if(this.isValidURL(this.link)){
        console.log("Validddd");
        //build card for textarea (could just enable card that is initially disabled orrrr create a new card object entirely?)
        this.shadowRoot.querySelector(".card").classList.remove("cardInvis");
        // this.shadowRoot.querySelector(".wrapper").append(this.shadowRoot.querySelector(".card").cloneNode(true)); - if I want to add the card obj instead of just turning it invis
      }
      else{
        console.log("invaliddddd");
        this.shadowRoot.querySelector(".card").classList.add("cardInvis");
      }
    }
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <!-- link -->
  <!-- <a href="${this.link}"><slot name="linkSlot">${this.link}</slot></a> -->
  <textarea class="textField" id="textFieldid" @paste="${this.updateLink}">Paste a link in me</textarea>
  <!-- card that appears below link maybe set initially to disabled, enable when valid link? -->
  <div class="card cardInvis">
    I'm a card, maybe I'll be attached to textarea in final version! <br>
    title: ${this.jsonTitle} <br>
    description: ${this.jsonDesc} <br>
    image: <img src=${this.jsonImg}> <br>
    link: <a href="${this.jsonLink}">${this.jsonLink}</a>
  </div>
</div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);