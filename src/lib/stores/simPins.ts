import { onDestroy } from "svelte";
import { writable } from "svelte/store";

export const simPins = writable<Set<number>>(new Set())

export function addSimPin(pin: number, options: { global?: boolean } = {}) {
    simPins.update(pins => {
        pins.add(pin)
        return pins
    })

    if (!options.global) {
        onDestroy(() => {
            simPins.update(pins => {
                pins.delete(pin)
                return pins
            })
        })
    }
}
