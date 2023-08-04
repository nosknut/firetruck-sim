import { createPin } from "./pins";

export const GAS_PEDAL_PIN = 1;
export const DIRECTION_PICKER_PIN = 2;
export const SPEED_SENSOR_PIN = 3;
export const DIRECTION_PIN = 4;
export const MOTOR_POWER_PIN = 5;
export const SPEEDOMETER_PIN = 6;

export const HEADLIGHTS_PICKER_PIN = 7;
export const HEADLIGHTS_PIN = 8;

export const FLASH_LEFT_PICKER_PIN = 9;
export const FLASH_LEFT_PIN = 10;

export const FLASH_RIGHT_PICKER_PIN = 11;
export const FLASH_RIGHT_PIN = 12;

export const WIPER_PICKER_PIN = 13;
export const WIPER_PIN = 14;

export const BOOM_UP_PICKER_PIN = 15;
export const BOOM_DOWN_PICKER_PIN = 16;
export const BOOM_ELEVATION_PIN = 18;

export const BOOM_LEFT_PICKER_PIN = 19;
export const BOOM_RIGHT_PICKER_PIN = 20;
export const BOOM_ROTATION_PIN = 22;

export const BOOM_ELBOW_OUT_PICKER_PIN = 23;
export const BOOM_ELBOW_IN_PICKER_PIN = 24;
export const BOOM_ELBOW_PIN = 25;

export const BOOM_WRIST_PIN = 28;

export const gasPedalPin = createPin(GAS_PEDAL_PIN, { global: true });
export const directionPickerPin = createPin(DIRECTION_PICKER_PIN, { global: true });
export const speedSensorPin = createPin(SPEED_SENSOR_PIN, { simPin: true, global: true });
export const directionPin = createPin(DIRECTION_PIN, { global: true });
export const motorPowerPin = createPin(MOTOR_POWER_PIN, { global: true });
export const speedometerPin = createPin(SPEEDOMETER_PIN, { global: true });

export const headlightPickerPin = createPin(HEADLIGHTS_PICKER_PIN, { global: true });
export const headlightPin = createPin(HEADLIGHTS_PIN, { global: true });

export const flashLeftPickerPin = createPin(FLASH_LEFT_PICKER_PIN, { global: true });
export const flashLeftPin = createPin(FLASH_LEFT_PIN, { global: true });

export const flashRightPickerPin = createPin(FLASH_RIGHT_PICKER_PIN, { global: true });
export const flashRightPin = createPin(FLASH_RIGHT_PIN, { global: true });

export const wiperPickerPin = createPin(WIPER_PICKER_PIN, { global: true });
export const wiperPin = createPin(WIPER_PIN, { global: true });

export const boomUpPickerPin = createPin(BOOM_UP_PICKER_PIN, { global: true });
export const boomDownPickerPin = createPin(BOOM_DOWN_PICKER_PIN, { global: true });
export const boomElevationPin = createPin(BOOM_ELEVATION_PIN, { global: true });

export const boomLeftPickerPin = createPin(BOOM_LEFT_PICKER_PIN, { global: true });
export const boomRightPickerPin = createPin(BOOM_RIGHT_PICKER_PIN, { global: true });
export const boomRotationPin = createPin(BOOM_ROTATION_PIN, { global: true });

export const boomElbowOutPickerPin = createPin(BOOM_ELBOW_OUT_PICKER_PIN, { global: true });
export const boomElbowInPickerPin = createPin(BOOM_ELBOW_IN_PICKER_PIN, { global: true });
export const boomElbowPin = createPin(BOOM_ELBOW_PIN, { global: true });

export const boomWristPin = createPin(BOOM_WRIST_PIN, { global: true });
