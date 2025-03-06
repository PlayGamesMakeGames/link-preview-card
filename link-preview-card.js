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
    this.link = "https://www.youtube.com/watch?v=tKR_l79txOU";
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
    `];
  }

  //fetch JSON of link and update variables we're looking for with info if it exists
  async getData(link) {
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${this.link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json.data);
      // document.querySelector('#here').innerHTML = JSON.stringify(json.data, null, 2); //dont think I need this line
      this.jsonTitle = json.data["title"];
      this.jsonDesc = json.data["description"];
      this.jsonImg = json.data["image"];
      this.jsonLink = json.data["url"];
    } catch (error) {
      console.error(error.message);
    }
    console.log(this.jsonTitle);
    console.log(this.jsonDesc);
    console.log(this.jsonImg);
    console.log(this.jsonLink);
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    //if paste detected update link in a different method(TODO), make sure link is valid, and call method with newly updated link
    if (changedProperties.has('link')) {
      //check if new link valid TODO
      this.getData(this.link);
    }
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <!-- link -->
  <a href="${this.link}"><slot name="linkSlot">${this.link}</slot></a>
  <textarea class="textField">Input text here</textarea>
  <!-- card that appears below link -->
  <div class="card">

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