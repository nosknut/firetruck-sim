import _ from "lodash";
import { writable } from "svelte/store"

import { serialPort } from "./serial"
import { toasts } from "./toasts";

type PinValueStore = {
    [pin: number | string]: number | undefined
}

type PinModeStore = {
    [pin: number | string]: 'input' | 'output' | undefined
}

function createPins() {
    // Needed to detect when to write changes to the serial port
    const pinValuesVersioningClone: PinValueStore = {}
    const pinModesVersioningClone: PinModeStore = {}

    const pinValues = writable<PinValueStore>({})

    const pinModes = writable<PinModeStore>({})

    const simPins = writable<Set<string>>(new Set())

    function setPinStore(pin: number | string, value: number | boolean) {
        pinValues.update((values) => {
            values[pin] = Number(value)
            pinValuesVersioningClone[pin] = Number(value)
            return values
        })
    }

    async function setPin(pin: number | string, value: number | boolean, options?: { ignoreClosed?: boolean }) {
        setPinStore(pin, value)
        await serialPort?.send({
            p: pin,
            v: value,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        }, options).catch(() => { })
    }

    function setPins(newValues: PinValueStore) {
        Object.keys(pinValuesVersioningClone).forEach((pin) => {
            if (pinValuesVersioningClone[pin] !== newValues[pin]) {
                setPin(pin, newValues[pin] || 0, { ignoreClosed: true }).catch((e) => {
                    console.error(e)
                    toasts.add(e.message)
                })
            }
        })
    }

    return {
        pins: {
            set: setPins,
            subscribe: pinValues.subscribe,
            update(cb: (currentValues: PinValueStore) => PinValueStore) {
                pinValues.update((values) => {
                    setPins(cb(values))
                    return values
                })
            },
            setPin,
        },
        simPins,
        modes: {
            subscribe: pinModes.subscribe,
        },
        sync: {
            store: {
                pinValue: setPinStore,
                pinMode(pin: number | string, mode: 'input' | 'output') {
                    pinModesVersioningClone[pin] = mode

                    pinModes.update((modes) => {
                        modes[pin] = mode
                        return modes
                    })

                    if (pinValuesVersioningClone[pin] === undefined) {
                        setPinStore(pin, 0)
                    }
                },
            },
            controller: {
                pinValue(pin: number | string) {
                    setPin(pin, pinValuesVersioningClone[pin] || 0)
                },
            },
        },
    }
}

const { pins, simPins, modes, sync } = createPins()

export { pins, simPins, modes }

serialPort.onReceive((data: { p: number; v: number } | { p: number; m: 'i' | 'o' } | { print: string }) => {
    if ('v' in data) {
        sync.store.pinValue(data.p, data.v);
    }
    if ('m' in data) {
        sync.store.pinMode(data.p, data.m === 'i' ? 'input' : 'output');
        // Resetting this because the controller has no idea
        if (data.m === 'o') {
            sync.store.pinValue(data.p, 0);
        } else {
            // Send the current sim value to the controller
            sync.controller.pinValue(data.p);
        }
    }
}).catch(console.error);
