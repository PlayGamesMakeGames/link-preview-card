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
    this.textValue = "";
    this.link = ""; //https://www.youtube.com/watch?v=tKR_l79txOU
    this.jsonTitle = "";
    this.jsonDesc = "";
    this.jsonImg = "";
    this.jsonLink = "";
    this.jsonThemeColor = "";
    document.documentElement.style.setProperty('--ddd-primary-x', `var(--ddd-primary-${Math.floor(Math.random() * 26)})`);
    document.documentElement.style.setProperty('--ddd-default-x', `var(--ddd-default-${Math.floor(Math.random() * 26)})`);
    this.loadingState = false;
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
      textValue: { type: String},
      link: { type: String, reflect: true},
      jsonTitle: { type: String },
      jsonDesc: { type: String },
      jsonImg: { type: String },
      jsonLink: { type: String },
      loadingState: { type: Boolean, reflect: true, attribute:"loading-state"},
      jsonThemeColor: { type: String, reflect: true },
      randNum: {type: Number},
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
        display: inline-flex;
        opacity: 1;
        pointer-events: all;
        margin: var(--ddd-spacing-2);
        border: var(--ddd-border-md);
        border-radius: var(--ddd-radius-lg);
        padding: var(--ddd-spacing-3);
        max-width: var(--ddd-breakpoint-lg);
        max-height: var(--ddd-breakpoint-lg);
        overflow: auto;
      }
      .cardInvis{
        display: none;
        opacity: 0;
        pointer-events: none;
        height: 0px;
        width: 0px;
      }
      .loader {
      border: 16px solid #f3f3f3; /* Light grey */
      border-top: 16px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 120px;
      height: 120px;
      animation: spin 2s linear infinite;
    }
    
    @media(min-width: 513px){
      #cardImgid{
        max-width: 512px;
        max-height: 256px;
        padding: var(--ddd-spacing-3);
      }
    }
    @media(max-width: 512px){
      /* :host{
        transform: scale(.5);
      } */
      #cardImgid{
      max-width: 256px;
      max-height: 128px;
    }
    }
    .card.psucolor {
      color: var(--ddd-primary-2); //nittany navy if psu based domain
      border-color: var(--ddd-primary-2);
      border-color: var(--ddd-default-2);
    }
    .card.default {
      color: var(--ddd-primary-x); //rand color between 0 and 25, set in constructor
      border-color: var(--ddd-primary-x);
      border-color: var(--ddd-default-x);
    }
    .card.themecolor {
      color: var(--theme-color); //json theme color
      border-color: var(--theme-color);
      border-color: var(--theme-color);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    `];
  }

  //fetch JSON of link and update variables we're looking for with info if it exists
  async getData(link) {
    this.loadingState = true;
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
      this.jsonThemeColor = json.data[Object.keys(json.data).filter(key => key.toLowerCase().includes("color"))[0]];
      console.log(this.jsonTitle);
      console.log(this.jsonDesc);
      console.log(this.jsonImg);
      console.log(this.jsonLink);
      console.log(this.jsonThemeColor);
      this.style.setProperty('--theme-color', this.jsonThemeColor || '--ddd-primary-x');
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
    finally{
      this.loadingState = false;
    }
  }

  //updates this.link when a paste event occurs in the text field  NOT BEING USED ANYMORE
  updateLink(event){
    this.jsonTitle = "";
    this.jsonDesc = "";
    this.jsonImg = "";
    this.jsonLink = "";
    this.jsonThemeColor = "";
    this.textValue = event.value;
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
      console.log(new URL(string));
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
    if (changedProperties.has('link') && this.link != "") {
      this.getData(this.link);
      console.log("gotdata from new link");
      //check if new link valid NEED TO FIX THIS NOW THAT LINK IS BEING CONSTANTLY UPDATED
      if(this.isValidURL(this.link)){
        console.log("Validddd");
        //build card for textarea (could just enable card that is initially disabled orrrr create a new card object entirely?)
        this.shadowRoot.querySelector(".card").classList.remove("cardInvis");
        //if psu based then make color nittany navy, else theme color exists so use that, else link is invalid so use random default color
        if(this.link.toLowerCase().includes("psu.edu")){
          this.shadowRoot.querySelector(".card").classList.remove("default");
          this.shadowRoot.querySelector(".card").classList.add("psucolor");
          this.shadowRoot.querySelector(".card").classList.remove("themecolor");
        }
        else{
          this.shadowRoot.querySelector(".card").classList.remove("default");
          this.shadowRoot.querySelector(".card").classList.remove("psucolor");
          this.shadowRoot.querySelector(".card").classList.add("themecolor");
        }
        // this.style.setProperty('--theme-color', this.jsonThemeColor || 'gray');
        // this.shadowRoot.querySelector(".wrapper").append(this.shadowRoot.querySelector(".card").cloneNode(true)); - if I want to add the card obj instead of just turning it invis
      }
      else{
        console.log("invaliddddd");
        this.jsonTitle = "";
        this.jsonDesc = "";
        this.jsonImg = "";
        this.jsonLink = "";
        // this.jsonThemeColor = "";
        this.shadowRoot.querySelector(".card").classList.add("cardInvis");
        this.shadowRoot.querySelector(".card").classList.add("default");
        this.shadowRoot.querySelector(".card").classList.remove("themecolor");
        this.shadowRoot.querySelector(".card").classList.remove("psucolor");
      }
    }

    // if (changedProperties.has('textValue') && this.textValue != ""){ Think ab this guy for trying to fix link being constantly updated, only should update on a paste event
    //   this.link = this.textValue;
    // }
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  
  <!-- link -->
  ${this.loadingState ? html`<div class="loader"></div>` : html``}
  
  <!-- <a href="${this.link}"><slot name="linkSlot">${this.link}</slot></a> -->
  <!-- MOVE TEXTAREA TO INDEX, DETECT A PASTE EVENT ON THE TEXTAREA, HAVE THAT CALL A METHOD THAT DOCUMENT.CREATECOMPONENT?(LINK-PREVIEW-CARD) AS A CHILD OF TEXTAREA -->
  <!-- <textarea class="textField" id="textFieldid" @paste="${this.updateLink}" style="display: ${this.loadingState ? 'none' : 'block'};">${this.textValue}</textarea> -->
  <!-- card that appears below link maybe set initially to disabled, enable when valid link? -->
  <div class="card cardInvis ${this.themeColor ? 'themecolor' : 'default'}" style="display: ${this.loadingState ? 'none' : 'block'};">
    ${this.jsonTitle ? html`Title: ${this.jsonTitle} <br>` : html``}
    ${this.jsonImg ? html`<img src=${this.jsonImg} id="cardImgid"> <br>` : html``}
    ${this.jsonDesc ? html`Description: ${this.jsonDesc} <br>` : html``}
    ${this.jsonLink ? html`Link: <a href="${this.jsonLink}">${this.jsonLink}</a>` : html``}
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