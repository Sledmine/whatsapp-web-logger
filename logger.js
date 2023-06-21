// ==UserScript==
// @name         Log WhatsApp Messages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Logs newly received messages from the left sidebar in WhatsApp Web to the console, including emotes and status messages (sent, received, read, etc)
// @author       Sledmine
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const messages = {};
    const interval = 80;

    setInterval(() => {
        let messageBoxes = document.querySelectorAll("[role=row] [data-testid=cell-frame-container]");
        for (let i = 0; i < messageBoxes.length; i++) {
            let messageBox = messageBoxes[i];
            let fromElement = messageBox.querySelector("[data-testid=cell-frame-title] > span[dir]");
            let messageElement = messageBox.querySelector("[data-testid=cell-frame-secondary] [title] > span[dir]");
            let statusCheckElement = messageBox.querySelector("[data-testid=status-check], [data-testid=status-dblcheck], [data-testid=status-time]");
            // Other message status elements: [data-testid=recalled], [data-testid=status-error]
            let emotes = messageElement.querySelectorAll("img");

            let from = fromElement.innerText;
            let msg = messageElement.innerHTML;
            for (let j = 0; j < emotes.length; j++) {
                let emote = emotes[j];
                msg = msg.replace(emote.outerHTML, emote.alt);
            }
            if (from && msg && !messages[from] || messages[from] !== msg) {
                messages[from] = msg;
                if (statusCheckElement) {
                    from = "You -> (" + from + ")";
                }
                newMessage(from, msg);
            }
        }
    }, interval);

    function newMessage(from, msg) {
        console.log(from + ": " + msg);
    }
})();