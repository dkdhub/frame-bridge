import FrameBridge from './bridge';
import {MSG_TYPE_INIT} from "./constants";

class FrameModalParent extends FrameBridge {
    constructor(config = {}) {
        super(config);
        this._element = null;
        this._iframe = null;
        this._visibility = false;

        let parentElement = config.mountPoint || document.getElementsByTagName('body')[0];
        // create modal
        this._element = document.createElement('div');
        this._element.className = 'frame-bridge-modal-wrapper';
        this._element.innerHTML =
            `<div class="frame-bridge-modal-wrapper_content">
                <iframe width="100%" height="100%" src=${config.url} frameborder="no" seamless></iframe>
            </div>`;
        this._iframe = this._element.getElementsByTagName('iframe')[0];
        this._iframe.onload = () => {
            this._initialized = false;
            this.bindMessagesListener(config.onMessage);
            this.init();
        };

        parentElement.appendChild(this._element);
        this.toggle(false);

        if (config.mountPoint) {
            this._element = config.mountPoint.appendChild(this._element);
        }
        this._element.onclick = () => {
            if (config.preventCloseOnOutsideClick){
                return;
            }
            this.toggle(false);
        };
    }

    _sendMessage(message) {
        return this._iframe.contentWindow.postMessage(message, '*');
    };

    getEventElement() {
        return window;
    };

    init() {
        if (this._initialized) {
            console.log("already initialized");
            return;
        }
        this.sendMessage({
            type: MSG_TYPE_INIT,
            waitForResponse: true,
            payload: {
                id: this._id
            }
        }).then(reply => {
            this._initialized = true;
        }).catch(e => {
            console.log("unable to initialize iframe bridge: ", e)
        });
    }

    toggle(visibility, params) {
        if (params && params.send) {
            // send message before toggle
            this.send(params.send);
        }
        this._visibility = !this._visibility;
        if (typeof visibility === "boolean") {
            this._visibility = visibility;
        }
        if (!this._element) return;
        this._element.style.display = this._visibility ? 'block' : 'none';
    };
}

export default FrameModalParent;
