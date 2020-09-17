import FrameBridge from './bridge';
import {MSG_TYPE_INIT} from './constants';

class FrameBridgeClient extends FrameBridge {
    constructor(config = {}) {
        super(config);

        let onMessage = config.onMessage ? config.onMessage : () => {
        };
        this.bindMessagesListener(onMessage);
        this.init();
    }

    init(){
        if (this._initialized) {
            console.log("client already initialized");
            return;
        }
        this.sendMessage({
            type: MSG_TYPE_INIT,
            waitForResponse: true,
            payload: {
                id: this._id
            }
        }).then(reply => {
            console.log("init response", reply)
            this._initialized = true;
        }).catch(e => {
            console.log("unable to initialize iframe bridge from client: ", e)
        });
    }

    _sendMessage(payload) {
        return window.parent.postMessage(payload, '*');
    }

    getEventElement() {
        return window;
    }
}

export default FrameBridgeClient;

