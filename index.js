const store = {};
const effect = {};
let fn = {}

export const startMiniBOB = () => {
    templates_to_ui_components();
    bind_click();

    QueryforEach("[minibob-bind]", el => {
        if (el.tagName === "INPUT") {
            el.addEventListener("input", ({ target: { value } }) => {
                el.setAttribute("value", value);
            })
        }
    });

    setInterval(() => {
        QueryforEach("[minibob-bind]", el => {
            const name = el.getAttribute("minibob-bind");
            const value = el.getAttribute("value");
            state[name] = value;
        });
    }, 100);
}

export const getData = (key) => {
    return store[key];
}

export const setData = (config) => {
    for (const [key, value] of Object.entries(config)) {
        state[key] = value;
    }
}

export const setMethods = (config) => {
    for (const [key, value] of Object.entries(config)) {
        fn[key] = value;
    }
}

export const setEffect = (config) => {
    for (const [key, fn] of Object.entries(config)) {
        effect[key] = fn;
    }
}

const QueryforEach = (select, callback) => {
    const elements = document.querySelectorAll(select);
    for (const el of elements) {
        callback(el);
    }
}

const handler = {
    set(obj, key, new_value) {

        for (const [name, fn] of Object.entries(effect)) {

            if (key === name) {
                const old_value = state[key];
                fn(new_value, old_value);
            }
        }

        QueryforEach(`[minibob-mark="${key}"]`, el => {
            el.innerText = new_value;
        });

        QueryforEach(`[minibob-bind="${key}"]`, el => {
            el.setAttribute("value", new_value);
        });

        QueryforEach(`[minibob-attr="${key}"]`, el => {
            el.setAttribute(`${key}`, new_value);
        });

        return Reflect.set(obj, key, new_value);
    }
}

const state = new Proxy(store, handler);

const templates_to_ui_components = () => {
    QueryforEach("template", template => {
        template.hasAttribute("name") ?
            customElements.define(
                template.getAttribute("name"),
                class extends HTMLElement {
                    constructor() {
                        super();
                        const shadowRoot = this.attachShadow({ mode: "open" });
                        const component = template.content.cloneNode(true);
                        shadowRoot.appendChild(component);
                    }
                }
            ) : () => { }
    });
}

const bind_click = () => {
    QueryforEach("[minibob-click]", el => {
        const name = el.getAttribute("minibob-click");
        el.addEventListener("click", () => {
            console.log(name);
            fn[name]();
        });
    });
}
