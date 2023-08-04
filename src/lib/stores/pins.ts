import { writable } from "svelte/store"

import type { Writable } from "svelte/store"
import { serialPort } from "./serial"
import { toasts } from "./toasts";
import type { SerialMessage } from "$lib/types/SerialMessage";
import type { PinMode } from "$lib/types/PinMode";
import { addSimPin } from "./simPins";
import { onDestroy } from "svelte";

export type Pin = {
    pin: number
    boolValue: boolean
    numberValue: number
    mode: PinMode
}

export const pins = writable<{
    [pin: number]: {
        store: Writable<Pin>
        pin: Pin
    }
}>({})

export function createPin(pin: number, options: { simPin?: boolean, global?: boolean } = {}) {
    // Used to send the initial value to the controller
    // if the mode is set to output
    let syncValue = 0
    let syncBoolValue = false

    const initialStore: Pin = {
        pin,
        boolValue: false,
        numberValue: 0,
        mode: undefined,
    }

    const store = writable(initialStore)

    if (options.simPin) {
        addSimPin(pin, options)
    }

    function setValue(value: number) {
        store.update((current) => {
            syncValue = value
            syncBoolValue = Boolean(value)
            return {
                ...current,
                numberValue: value,
                boolValue: Boolean(value),
            }
        })
    }

    function setMode(mode: PinMode) {
        store.update((current) => {
            return {
                ...current,
                mode,
            }
        })
    }

    async function sendValue(value: number) {
        await serialPort?.send({
            p: pin,
            v: value,
        }, { ignoreClosed: true }).catch((e) => {
            console.error(e)
            toasts.add(e.message)
        })
    }

    function setStore(value: Pin) {
        if (value.numberValue !== syncValue) {
            setValue(value.numberValue)
            sendValue(value.numberValue)
        } else if (value.boolValue !== syncBoolValue) {
            setValue(Number(value.boolValue))
            sendValue(Number(value.boolValue))
        }
    }

    serialPort.onReceive((data: SerialMessage) => {
        if (!('p' in data)) return;
        if (pin !== data.p) return;

        if ('v' in data) {
            setValue(data.v);
        }

        if ('m' in data) {
            setMode(data.m === 'i' ? 'input' : 'output');
            
            if (data.m === 'i') {
                // Send the current sim value to the controller
                sendValue(syncValue);
            }
        }
    }).catch(console.error);

    const wrappedStore = {
        subscribe: store.subscribe,
        set: setStore,
        update(cb: (currentValue: Pin) => Pin) {
            store.update((current) => {
                setStore(cb(current))
                return current
            })
        }
    }

    pins.update((current) => {
        current[pin] = {
            store: wrappedStore,
            pin: initialStore,
        }
        return current
    })

    const unsubscribe = store.subscribe((value) => {
        pins.update((current) => {
            if (current[pin]) {
                current[pin].pin = value
            }
            return current
        })
    })

    if (!options.global) {
        onDestroy(unsubscribe)
    }

    return wrappedStore
}

export type PinStore = Writable<Pin>
