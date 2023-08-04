import type { Transform } from "./Transform";

export type VehicleState = {
    speed: number;
    turn: number;
    lights: {
        headlights: boolean;
        flash: {
            left: boolean;
            right: boolean;
        };
    };
    wiper: number;
    boom: {
        rotation: number;
        elevation: number;
        elbow: number;
        wrist: number;
    };
    transform: Transform;
};
