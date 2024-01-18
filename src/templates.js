"use strict";

import {
  ICON_COLOR,
  WARNING_COLOR,
  MENU_ID,
  MENU_CONTENT_ID,
  MENU_STOP_ID,
  MENU_REMOVE_ALL_ID,
  MENU_FEEDBACK_ID,
  MENU_LICENSE_ID,
  MENU_LICENSE_INPUT_ID,
  MENU_LICENSE_BUTTON_ID,
  MENU_LICENSE_MODAL_ID,
  MENU_LICENSE_ADVICE_ID,
  GUMROAD_PRODUCT_URL,
} from "./constants";

import { STOP_SVG, FEEDBACK_SVG, LICENSE_SVG, TRASH_SVG } from "./assets";

export const floatingMenuTemplate = `
<style>
    :host {
        all: initial;
        position: fixed;
        top: 90%;
        left: 50%;
        z-index: 1001;
        font-family: sans-serif;
    }
    #${MENU_CONTENT_ID} {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        width: 400px;
        height: auto !important;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
    }
    #${MENU_CONTENT_ID} > div {
        display: flex;
        flex-direction: row !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 20px !important;
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
    #${MENU_LICENSE_MODAL_ID} {
      position: fixed;
      bottom: 13%;
      left: 50%;
      width: 400px !important;
      height: 40px !important;
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1002;
      transform: translate(-50%, -50%);
      background-color: white;
      font-family: sans-serif;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
      gap: 10px;
    }
    #${MENU_LICENSE_MODAL_ID} > div {
      display: flex !important;
      flex-direction: row !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 10px !important;
    }
    #${MENU_LICENSE_MODAL_ID} > div > input {
      width: 200px !important;
      height: 30px !important;
      border-radius: 5px !important;
      border: 1px solid #ccc !important;
      outline: none !important;
      padding: 0 10px !important;
    }
    #${MENU_LICENSE_MODAL_ID} > div > button {
      width: 100px !important;
      height: 30px !important;
      border-radius: 5px !important;
      border: 1px solid #ccc !important;
      background-color: #3366CC !important;
      color: white !important;
      padding: 0 10px !important;
      margin: 0 !important;
      cursor: pointer !important;
      font-weight: 600 !important;
      font-size: 12px !important;
    }
    #${MENU_LICENSE_ADVICE_ID} {
      display: none;
    }
    #${MENU_LICENSE_ADVICE_ID} > p {
      margin: 0 !important;
      padding: 0 !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      text-align: center !important;
    }
    #${MENU_LICENSE_ADVICE_ID} > p > a {
      color: ${WARNING_COLOR} !important;
    }
</style>
<div id="${MENU_ID}">
  <div id="${MENU_LICENSE_MODAL_ID}">
    <div>
      <input type="input" id="${MENU_LICENSE_INPUT_ID}" placeholder="Enter license here" />
      <button type="button" id="${MENU_LICENSE_BUTTON_ID}">Submit</button>
    </div>
  </div>
  <div id="${MENU_CONTENT_ID}">
    <div id="${MENU_LICENSE_ADVICE_ID}">
      <p>
        <a href="${GUMROAD_PRODUCT_URL}" target="_blank">
          FREE TRIAL: To save your changes, please activate a license.
        </a>
      </p>
    </div>
    <div>
      <button type="button" id="${MENU_STOP_ID}">
        ${STOP_SVG}
        <label>Stop</label>
      </button>
      <button type="button" id="${MENU_FEEDBACK_ID}">
        ${FEEDBACK_SVG}
        <label>Feedback</label>
      </button>
      <button type="button" id="${MENU_LICENSE_ID}">
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
  </div>
</div>
`;
