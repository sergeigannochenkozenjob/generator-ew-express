import Redis from 'ioredis';

export class InterCom {
    constructor({ url, streamName = 'intercom' } = {}) {
        this.url = url;
        this.streamName = streamName;
        this.enabled = false;

        this.commandConnection = new Redis(url);
        this.pollConnection = new Redis(url);

        this.onHandlers = {};
    }

    async start() {
        this.enabled = true;
        while (this.enabled) {
            const items = await this.xread();

            items.forEach(event => {
                if (this.onHandlers[event.name]) {
                    this.onHandlers[event.name].forEach(handler => {
                        handler(event.value);
                    });
                }
            });
        }
    }

    stop() {
        this.enabled = false;
    }

    async send(name, value = '') {
        this.commandConnection.xadd(
            this.streamName,
            '*',
            'event_name',
            name,
            'value',
            value,
        );
    }

    on(eventName, fn) {
        if (typeof fn === 'function') {
            this.onHandlers[eventName] = this.onHandlers[eventName] || [];
            this.onHandlers[eventName].push(fn);
        }
    }

    off(eventName, fn) {
        // todo
    }

    async xread() {
        return new Promise((resolve, reject) => {
            this.pollConnection.xread(
                'BLOCK',
                0,
                'STREAMS',
                this.streamName,
                'S',
                (err, stream) => {
                    if (err) {
                        reject(err);
                    } else if (stream) {
                        const streamData = stream.find(
                            streamResult => streamResult[0] === this.streamName,
                        );

                        if (streamData) {
                            const events = streamData[1];

                            resolve(
                                events.map(event => ({
                                    name: event[1][1],
                                    value: event[1][3],
                                })),
                            );
                        }
                    }
                },
            );
        });
    }
}
