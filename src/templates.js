"use strict";

import {
  APP_MAKER,
  ICON_COLOR,
  MENU_ID,
  MENU_CONTENT_ID,
  MENU_STOP_ID,
  MENU_REMOVE_ALL_ID,
  MENU_FEEDBACK_ID,
} from "./constants";

import {
  STOP_SVG,
  FEEDBACK_SVG,
  LICENSE_SVG,
  SETTINGS_SVG,
  TRASH_SVG,
} from "./assets";

export const floatingMenuTemplate = `
<style>
    :host {
        all: initial;
        position: fixed;
        top: 90%;
        left: 50%;
        width: 400px !important;
        height: auto !important;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
        z-index: 1001;
        font-family: sans-serif;
    }
    #${MENU_CONTENT_ID} {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    #${MENU_CONTENT_ID} > div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding: 10px;
    }
    button {
        background: none !important;
        color: inherit !important;
        border: none !important;
        padding: 0 !important;
        font: inherit !important;
        cursor: pointer !important;
        outline: inherit !important;
        margin-top: 10px !important;
    }
    p {
        margin: 10px 0 !important;
        padding: 0 !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        color: ${ICON_COLOR} !important;
        text-align: center !important;
    }
    label {
        padding: 0 !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        text-align: center !important;
        color: ${ICON_COLOR} !important;
        display: block;
    }
    span {
        margin-bottom: 10px !important;
        padding: 0 !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        color: ${ICON_COLOR} !important;
        text-align: center !important;
    }
</style>
<div id="${MENU_ID}">
  <div id="${MENU_CONTENT_ID}">
    <div>
      <button type="button" id="${MENU_STOP_ID}">
        ${STOP_SVG}
        <label>Stop</label>
      </button>
      <button type="button" id="${MENU_FEEDBACK_ID}">
        ${FEEDBACK_SVG}
        <label>Feedback/Bug</label>
      </button>
      <button type="button" id="${MENU_REMOVE_ALL_ID}">
        ${SETTINGS_SVG}
        <label>Settings</label>
      </button>
      <button type="button" id="${MENU_REMOVE_ALL_ID}">
        ${LICENSE_SVG}
        <label>License</label>
      </button>
      <button type="button" id="${MENU_REMOVE_ALL_ID}">
        ${TRASH_SVG}
        <label>Remove all</label>
      </button>
    </div>
    <p>
      Click on the elements you want to blur. 
    </p>
    <span>Made by <a href="https://twitter.com/${APP_MAKER}" target="_blank">${APP_MAKER}</a></span>
  </div>
</div>
`;
