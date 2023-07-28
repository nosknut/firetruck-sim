import { writable } from "svelte/store"

import { serialPort } from "./serial"

function createPins() {
    const { subscribe, set, update } = writable<{
        [pin: number | string]: number
    }>({
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: 0,
    })

    function syncPin(pin: number | string, value: number | boolean) {
        update((pins) => {
            pins[pin] = Number(value)
            return pins
        })
    }

    return {
        subscribe,
        syncPin,
        async setPin(pin: number | string, value: number | boolean) {
            await serialPort?.send({
                pin,
                value,
            })
            syncPin(pin, value)
        },
    }
}

export const pins = createPins()

serialPort.onReceive((data: { pin: number; value: number } | { print: string }) => {
    if ('pin' in data) {
        pins.syncPin(data.pin, data.value);
    }
}).catch(console.error);
