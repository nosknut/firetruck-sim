import { JsonParser } from '$lib/helpers/JsonParser';
import { writable } from "svelte/store";

function createSerialPort() {
    const store = writable({ isOpen: false });

    const encoder = new TextEncoder();

    let port: SerialPort | null = null;
    const portStore = writable<SerialPort | null>(null);

    const callbacks: ((data: any) => void)[] = [];

    async function write(data: string) {
        if (port) {
            const writer = port.writable.getWriter();
            try {
                await writer.write(encoder.encode(data));
            } finally {
                writer.releaseLock();
            }
        } else {
            throw new Error("No open connection");
        }
    }

    return {
        subscribe: store.subscribe,
        async open(options: SerialOptions) {
            port = await navigator.serial.requestPort();
            await port.open(options);
            portStore.set(port)

            const parser = JsonParser();

            port.readable
                .pipeThrough(new TextDecoderStream())
                .pipeTo(new WritableStream({
                    write(chunk) {
                        parser.parse(chunk).forEach((data) => {
                            callbacks.forEach((callback) => {
                                callback(data);
                            });
                        });
                    }
                }))

            store.update(val => ({ ...val, isOpen: true }))
        },
        async close() {
            port?.readable.cancel("User closed port")
            await port?.close()

            portStore.set(null)
            port = null

            while (callbacks.length > 0) {
                callbacks.pop();
            }

            store.update(val => ({ ...val, isOpen: false }))
        },
        async send(data: any) {
            await write(JSON.stringify(data));
        },
        write,
        async onReceive(callback: (data: any) => void) {
            callbacks.push(callback);
        }
    }
}

export const serialPort = createSerialPort()
