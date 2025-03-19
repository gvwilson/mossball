/**
 * @file utils.js
 * @description Utility functions for layout
 */
import tippy from "https://esm.sh/tippy.js@6";
import swal from "https://esm.sh/sweetalert2@11";
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
        content: textContent || CONSTANTS.DEFAULT_TOOLTIP_TEXT,
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

/**
 * Render modal
 * @param {string} title
 * @param {string} text
 * @param {string} icon
 * @param {string} buttonText
 * @param {function} closeAction
 */
const showModal = (title, text, icon, buttonText, closeAction) => {
    swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: buttonText,
        confirmButtonColor: "#2858b3",
        buttonsStyling: true,
        // hacky styling because custom class didnt work
        didOpen: (popup) => {
            const button = popup.querySelector(".swal2-confirm");
            button.style.borderRadius = "18px";
            button.style.padding = "0.4rem 1.6rem 0.4rem 1.5rem;";
        },
    }).then(() => {
        closeAction();
    });
};

export { createElement, setupLayout, showModal };
