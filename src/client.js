import FrameBridge from './bridge';

class FrameBridgeClient extends FrameBridge {
    constructor(config = {}) {
        super(config);
        let onMessage = config.onMessage ? config.onMessage : message => {
        };
        this.bindMessagesListener(onMessage);
    }

    _sendMessage(payload) {
        return window.parent.postMessage(payload, '*');
    };

    getEventElement() {
        return window;
    }
}

export default FrameBridgeClient;

