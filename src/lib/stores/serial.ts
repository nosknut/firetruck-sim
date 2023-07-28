/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonParser } from '$lib/helpers/JsonParser';
import { createPinMessage, createPrintMessage, MicroParser } from '$lib/helpers/MicroParser';
import { writable } from "svelte/store";

function createSerialPort() {
    const store = writable<{
        isOpen: boolean;
        connectionType: "serial" | "websocket" | null;
    }>({
        isOpen: false,
        connectionType: null,
    });

    const encoder = new TextEncoder();

    // eslint-disable-next-line prefer-const
    let messageFormat: 'json' | 'micro' = 'micro';

    let port: SerialPort | null = null;
    let webSocket: WebSocket | null = null;

    const portCallbacks: ((data: any) => void)[] = [];
    const webSocketCallbacks: ((data: any) => void)[] = [];

    async function write(data: string) {
        if (port) {
            const writer = port.writable.getWriter();
            try {
                await writer.write(encoder.encode(data));
            } finally {
                writer.releaseLock();
            }
        } else if (webSocket) {
            webSocket.send(data);
        } else {
            throw new Error("No open connection");
        }
    }

    return {
        subscribe: store.subscribe,
        async openSerialPort(options: SerialOptions) {
            if (port || webSocket) {
                throw new Error("Port already open");
            }

            port = await navigator.serial.requestPort();
            await port.open(options);

            const parser = messageFormat == 'json' ? JsonParser() : MicroParser();

            port.readable
                .pipeThrough(new TextDecoderStream())
                .pipeTo(new WritableStream({
                    write(chunk) {
                        parser.parse(chunk).forEach((data) => {
                            portCallbacks.forEach((callback) => {
                                callback(data);
                            });
                        });
                    }
                }))

            store.set({ isOpen: true, connectionType: "serial" })
        },
        async openWebSocket(url: string) {
            if (port || webSocket) {
                throw new Error("Port already open");
            }

            await new Promise<void>((resolve, reject) => {
                const ws = new WebSocket(url);

                ws.onerror = (event) => {
                    reject(event);
                }

                ws.onopen = () => {
                    const parser = JsonParser();

                    ws.onmessage = (event) => {
                        parser.parse(event.data).forEach((data) => {
                            webSocketCallbacks.forEach((callback) => {
                                callback(data);
                            });
                        });
                    };

                    webSocket = ws;
                    store.set({ isOpen: true, connectionType: "websocket" })

                    resolve();
                }
            });
        },
        async close() {
            port?.readable.cancel("User closed port")
            await port?.close().catch(() => {
                // TODO: Find out how to close the serial port without reloading the page
                window.location.reload();
            });
            await webSocket?.close()

            port = null
            webSocket = null

            store.set({ isOpen: false, connectionType: null })
        },
        async send(data: any) {
            if (messageFormat === 'json') {
                await write(JSON.stringify(data));
            }
            if (messageFormat === 'micro') {
                if ('pin' in data) {
                    await write(createPinMessage(data.pin, data.value));
                } else if ('print' in data) {
                    await write(createPrintMessage(data.print));
                }
            }
        },
        write,
        async onReceive(callback: (data: any) => void) {
            portCallbacks.push(callback);
            webSocketCallbacks.push(callback);
        }
    }
}

export const serialPort = createSerialPort()
