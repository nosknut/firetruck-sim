import { writable } from "svelte/store";

import { serialPort } from "./serial";
import type { SerialMessage } from "$lib/types/SerialMessage";

export const serialMonitor = writable('');

serialPort.onReceive((data: SerialMessage) => {
    if ('print' in data) {
        serialMonitor.update((value) => value + data.print)
        // console.log('Serial: ', data.print);
    }
}).catch(console.error);
