import type { VehicleState } from "$lib/types/VehicleState";
import { writable } from "svelte/store";
import { Vector3 } from "three";

export function createVehicleState() {
    const state = writable<VehicleState>({
        speed: 0,
        turn: 0,
        boom: {
            rotation: 0,
            elevation: 0,
            elbow: 0,
            wrist: 0,
        },
        lights: {
            headlights: false,
            flash: {
                left: false,
                right: false,
            },
        },
        wiper: 0,
        transform: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0)
        },
    });

    return {
        ...state,
        stop() {
            state.update((s) => {
                s.speed = 0;
                s.turn = 0;
                return s;
            });
        }
    };
}

export type VehicleStateStore = ReturnType<typeof createVehicleState>;
