import { writable } from "svelte/store";

import { serialPort } from "./serial";

export const serialMonitor = writable('');

serialPort.onReceive((data: { p: number; v: number } | { print: string }) => {
    if ('print' in data) {
        serialMonitor.update((value) => value + data.print)
        console.log('Serial: ', data.print);
    }
}).catch(console.error);
