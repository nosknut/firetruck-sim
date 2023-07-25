import type { VehicleState } from "$lib/types/VehicleState";
import { Vector3 } from "three";

export function createVehicleState() {
    const state: VehicleState = {
        speed: 0,
        turn: 0,
        transform: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0)
        },
    };

    return {
        state,
        stop() {
            state.speed = 0;
            state.turn = 0;
        },
    };
}
