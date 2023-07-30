/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonParser } from '$lib/helpers/JsonParser';
import { writable } from "svelte/store";

import { toasts } from './toasts';

function createSerialPort() {
    const store = writable<{
        isOpen: boolean;
        connectionType: "serial" | "websocket" | null;
    }>({
        isOpen: false,
        connectionType: null,
    });

    const encoder = new TextEncoder();

    let port: SerialPort | null = null;
    let webSocket: WebSocket | null = null;

    const portCallbacks: ((data: any) => void)[] = [];
    const webSocketCallbacks: ((data: any) => void)[] = [];

    async function write(data: string, options?: { ignoreClosed?: boolean }) {
        if (port) {
            if (port.writable.locked) {
                throw new Error("Port is used by a different program");
            }

            const writer = port.writable.getWriter();
            try {
                await writer.write(encoder.encode(data));
            } finally {
                writer.releaseLock();
            }
        } else if (webSocket) {
            webSocket.send(data);
        } else if (!options?.ignoreClosed) {
            throw new Error("No open connection");
        }
    }

    async function close() {
        await port?.close().catch(() => {
            // TODO: Find out how to close the serial port without reloading the page
            window.location.reload();
        });
        await webSocket?.close()

        port = null
        webSocket = null

        store.set({ isOpen: false, connectionType: null })
    }

    return {
        subscribe: store.subscribe,
        async openSerialPort(options: SerialOptions) {
            if (port || webSocket) {
                throw new Error("Port already open");
            }

            port = await navigator.serial.requestPort();
            await port.open(options);

            const parser = JsonParser();

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
                let resolved = false;

                const ws = new WebSocket(url);

                ws.onerror = (event) => {
                    if (!resolved) {
                        reject(event);
                    }

                    console.error(event);
                    toasts.add("Unable to connect to WebSocket");

                    close();
                }

                ws.onclose = close;

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

                    resolved = true;
                    resolve();
                }
            });
        },
        async close() {
            port?.readable.cancel("User closed port");
            await close();
        },
        async send(data: any, options?: { ignoreClosed?: boolean }) {
            await write(JSON.stringify(data), options);
        },
        write,
        async onReceive(callback: (data: any) => void) {
            portCallbacks.push(callback);
            webSocketCallbacks.push(callback);
        }
    }
}

export const serialPort = createSerialPort()
