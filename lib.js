export class MiniBob extends HTMLElement {
    loadExternalStyle(href) {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", href);
        this.shadowRoot.appendChild(linkElem);
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.subMultilingualComponents = [];
    }
    addToSubMultilingualComponents(x) {
        this.subMultilingualComponents.push(x);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "language") {
            for (const el of this.shadowRoot.querySelectorAll('[multilingual]')) {
                el.innerText = el.getAttribute(newValue);
            }

            for (const el of this.shadowRoot.querySelectorAll('[multiurl]')) {
                el.setAttribute("href", el.getAttribute(`${newValue}-url`));
            }

            for (const el of this.subMultilingualComponents) {
                el.setAttribute("language", newValue);
            }
        }
    }
    static get observedAttributes() {
        return ["language"]
    }
};
