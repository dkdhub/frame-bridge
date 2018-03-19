class RPCQueue {
    constructor() {
        this._queue = {};
    }

    add(id, request, options = {}) {
        if (!options.timeout) {
            options.timeout = 30000;
        }
        let ts = new Date().getTime();
        return new Promise((resolve, reject) => {
            let ttlTimeoutId = setTimeout(() => {
                console.log("reject task '%s' by timeout %sms", id, options.timeout);
                this.taskDone(id, {timeout: true, message: 'Timeout!'}, false);
            }, options.timeout);

            this._queue[id] = {
                id,
                ts,
                ttlTimeoutId,
                request,
                resolve,
                reject,
                options
            }
        })
    }

    taskDone(id, result, isSuccessful) {
        let request = this._queue[id];
        if (!request) {
            console.log("request %s not in queue", id);
            return;
        }
        delete this._queue[id];
        let method = isSuccessful ? 'resolve' : 'reject';
        request[method](result);
        try {
            clearTimeout(request.ttlTimeoutId);
        } catch (e) {
            console.log("clear timeout error: ", e);
        }
        return true;
    };
}

export default RPCQueue;



