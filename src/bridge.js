import {uniqId} from './utils';
import RPCQueue from './rpc-queue';
import {
    INIT_SUCCESS, INIT_SUCCESS_PASSIVE,
    MSG_TYPE_INIT, MSG_TYPE_INIT_REPLY,
    MSG_TYPE_MESSAGE,
    MSG_TYPE_RPC_CALL,
    MSG_TYPE_RPC_REPLY, MSG_TYPES
} from './constants';

class FrameBridge {
    constructor(config) {
        this._config = config;
        this._id = uniqId('bridge');
        this._rpcQueue = new RPCQueue();
    }


    _sendMessage(payload) {
        console.warn('send message not implemented!')
    }

    getEventElement() {
        console.warn('get event element not implemented');
    }

    init() {
        console.error('init not implemented');
    };

    sendMessage(message = {}, options) {
        let id = uniqId('message');
        message = Object.assign(message, {id, domain: this._id, options});
        this._sendMessage(message);
        if (message.waitForResponse) {
            return this._rpcQueue.add(id, message, options);
        }
    };

    rpc(payload, options) {
        return this.sendMessage({payload, type: MSG_TYPE_RPC_CALL, waitForResponse: true}, options);
    };

    send(payload, options) {
        return this.sendMessage({payload, type: MSG_TYPE_MESSAGE}, options);
    }

    bindMessagesListener(callback = () => {
    }) {
        let element = this.getEventElement();
        if (callback) {
            this._eventsListener = e => {
                let message = e.data || {};
                if (message.type === MSG_TYPE_INIT) {
                    this._id = message.payload.id;
                    this.sendMessage({
                        type: MSG_TYPE_INIT_REPLY,
                        replyFor: message.id,
                        payload: {type: INIT_SUCCESS, passive: false, connection_id: this._id}
                    });
                    callback({type: INIT_SUCCESS, passive: true, connection_id: this._id})
                    return;
                }
                if (!message.domain || message.domain !== this._id) {
                    return;
                }

                if (message.replyFor) {
                    this._rpcQueue.taskDone(message.replyFor, message.payload, true);
                    if (message.type === MSG_TYPE_RPC_REPLY) {
                        return;
                    }
                }

                Promise.resolve(callback(message.payload))
                    .catch(e => e)
                    .then(response => {
                        if (message.waitForResponse) {
                            this.sendMessage({
                                type: MSG_TYPE_RPC_REPLY,
                                replyFor: message.id,
                                payload: response
                            });
                        }
                    })
            };
        }
        element.addEventListener('message', this._eventsListener);
    };
}

export default FrameBridge;
