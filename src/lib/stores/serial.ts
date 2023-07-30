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

    async function close(reload: boolean) {
        await port?.close().catch(() => {
            // TODO: Find out how to close the serial port without reloading the page
            if (reload) {
                window.location.reload();
            }
        });
        await webSocket?.close()

        port = null
        webSocket = null

        store.set({ isOpen: false, connectionType: null })
    }

    async function write(data: string, options?: { ignoreClosed?: boolean }) {
        if (port) {
            // TODO: Find out why the port is always locked
            // if (port.writable.locked) {
            //     toasts.add('Port is used by a different program');
            //     console.error('Port is used by a different program');
            //     await close(false);
            //     throw new Error("Port is used by a different program");
            // }
            try {

                const writer = port.writable.getWriter();

                await writer.write(encoder.encode(data))
                    .catch(async (e) => {
                        toasts.add('Error when writing to controller: ' + e.message);
                        console.error(e);
                        await close(false);
                        throw new Error(e);
                    }).finally(() => {
                        writer.releaseLock();
                    });
            } catch (e) {
                console.error(e)
            }

        } else if (webSocket) {
            webSocket.send(data);
        } else if (!options?.ignoreClosed) {
            toasts.add('No open connection');
            console.error('No open connection')
            await close(false);
            throw new Error("No open connection");
        }
    }

    return {
        subscribe: store.subscribe,
        async openSerialPort(options: SerialOptions) {
            if (port || webSocket) {
                throw new Error("Port already open");
            }

            const serialPort = await navigator.serial.requestPort();

            try {
                await serialPort.open(options);
            } catch (e: any) {
                console.error(e)
                toasts.add('Failed to open Serial Port');
                throw e;
            }

            const parser = JsonParser();

            serialPort.readable
                .pipeThrough(new TextDecoderStream())
                .pipeTo(new WritableStream({
                    write(chunk) {
                        if (serialPort) {
                            parser.parse(chunk).forEach((data) => {
                                portCallbacks.forEach((callback) => {
                                    callback(data);
                                });
                            });
                        }
                    }
                }))

            serialPort.ondisconnect = () => {
                toasts.add('Port disconnected');
                console.error('Port disconnected');
                close(false)
            };

            port = serialPort;
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

                    close(false);
                }

                ws.onclose = () => {
                    if (!resolved) {
                        reject();
                    }

                    console.error("WebSocket closed");
                    toasts.add("WebSocket closed");

                    close(false)
                };

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
            await close(true);
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
