/**
 * @file utils.js
 * @description Utility functions for layout
 */
import tippy from "https://esm.sh/tippy.js@6";
import CONSTANTS from "./constants";

/**
 * Create an HTML element with the given tag and props
 * @param {string} tag
 * @param {object} props
 * @returns {HTMLElement}
 */
const createElement = (tag, props) => {
  const element = document.createElement(tag);
  Object.keys(props).forEach((key) => {
    if (key === "style" && typeof props[key] === "object") {
      Object.assign(element.style, props[key]);
      return;
    }
    element[key] = props[key];
  });
  return element;
};

/**
 * Setup the tooltip
 * @param {HTMLElement} helpTooltip
 */
const setupTippyTooltip = (helpTooltip, textContent) => {
  tippy(helpTooltip, {
    content:
      textContent || CONSTANTS.DEFAULT_TOOLTIP_TEXT,
    interactive: true,
    arrow: true,
    popperOptions: {
      modifiers: [
        {
          name: "arrow",
          options: {
            element: ".tippy-arrow",
          },
        },
      ],
    },
  });
};

/**
 * Setup the layout of the game from the root element
 * @param {HTMLElement} el
 * @param {object} data
 */
const setupLayout = (el, data) => {
  let container = createElement("div", { className: "container" });
  let gameContainer = createElement("div", { className: "game-container" });
  let title = createElement("h2", {
    className: "title",
    innerHTML: data.title,
  });
  let helpTooltip = createElement("button", {
    className: "info-tooltip",
    innerHTML: "i",
  });

  setupTippyTooltip(helpTooltip, data.instructions);

  let mainArea = createElement("div", { className: "main-area" });

  el.appendChild(container);
  container.appendChild(gameContainer);
  gameContainer.appendChild(title);
  title.appendChild(helpTooltip);
  gameContainer.appendChild(mainArea);

  let leftColumn = createElement("div", { className: "left-column" });
  let rightColumn = createElement("div", { className: "right-column" });

  mainArea.append(leftColumn, rightColumn);

  return {
    container,
    gameContainer,
    title,
    leftColumn,
    rightColumn,
  };
};

export { createElement, setupLayout };
