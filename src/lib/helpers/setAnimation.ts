import type { AnimationAction } from "three";

export function setAnimation(action: AnimationAction | undefined, time: number) {
    if (!action) return;

    if (!action.paused) {
        action.setDuration(1);
        action.paused = true;
        action.play();
    }

    if (action.time === time) return;

    action.time = time;
}
