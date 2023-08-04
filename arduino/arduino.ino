#include "FiretruckSim.h"

const int GAS_PEDAL_PIN = 1;
const int DIRECTION_PICKER_PIN = 2;
const int SPEED_SENSOR_PIN = 3;
const int DIRECTION_PIN = 4;
const int MOTOR_POWER_PIN = 5;
const int SPEEDOMETER_PIN = 6;

const int HEADLIGHTS_PICKER_PIN = 7;
const int HEADLIGHTS_PIN = 8;

const int FLASH_LEFT_PICKER_PIN = 9;
const int FLASH_LEFT_PIN = 10;

const int FLASH_RIGHT_PICKER_PIN = 11;
const int FLASH_RIGHT_PIN = 12;

const int WIPER_PICKER_PIN = 13;
const int WIPER_PIN = 14;

const int BOOM_UP_PICKER_PIN = 15;
const int BOOM_DOWN_PICKER_PIN = 16;
const int BOOM_ELEVATION_PIN = 18;

const int BOOM_LEFT_PICKER_PIN = 19;
const int BOOM_RIGHT_PICKER_PIN = 20;
const int BOOM_ROTATION_PIN = 22;

const int BOOM_ELBOW_OUT_PICKER_PIN = 23;
const int BOOM_ELBOW_IN_PICKER_PIN = 24;
const int BOOM_ELBOW_PIN = 25;

const int BOOM_WRIST_PIN = 28;

unsigned long timer = 0;
unsigned long boomTimer = 0;
unsigned long printTimer = 0;
unsigned long flashTimer = 0;
unsigned long wiperTimer = 0;

int wiperState = 0;
int wiperTarget = 0;
int boomElbowState = 0;
bool flashState = false;
int boomRotationState = 0;
int boomElevationState = 0;

void setup()
{
    Serial.begin(115200);

    pinMode(GAS_PEDAL_PIN, INPUT);
    pinMode(DIRECTION_PICKER_PIN, INPUT);
    pinMode(SPEED_SENSOR_PIN, INPUT);

    pinMode(DIRECTION_PIN, OUTPUT);
    pinMode(MOTOR_POWER_PIN, OUTPUT);
    pinMode(SPEEDOMETER_PIN, OUTPUT);

    pinMode(HEADLIGHTS_PICKER_PIN, INPUT);
    pinMode(HEADLIGHTS_PIN, OUTPUT);

    pinMode(FLASH_LEFT_PICKER_PIN, INPUT);
    pinMode(FLASH_LEFT_PIN, OUTPUT);

    pinMode(FLASH_RIGHT_PICKER_PIN, INPUT);
    pinMode(FLASH_RIGHT_PIN, OUTPUT);

    pinMode(WIPER_PICKER_PIN, INPUT);
    pinMode(WIPER_PIN, OUTPUT);

    pinMode(BOOM_UP_PICKER_PIN, INPUT);
    pinMode(BOOM_DOWN_PICKER_PIN, INPUT);
    pinMode(BOOM_ELEVATION_PIN, OUTPUT);

    pinMode(BOOM_LEFT_PICKER_PIN, INPUT);
    pinMode(BOOM_RIGHT_PICKER_PIN, INPUT);
    pinMode(BOOM_ROTATION_PIN, OUTPUT);

    pinMode(BOOM_ELBOW_OUT_PICKER_PIN, INPUT);
    pinMode(BOOM_ELBOW_IN_PICKER_PIN, INPUT);
    pinMode(BOOM_ELBOW_PIN, OUTPUT);

    pinMode(BOOM_WRIST_PIN, OUTPUT);
}

int motorPower = 0;

void loop()
{
    int gasPedal = analogRead(GAS_PEDAL_PIN);
    int direction = analogRead(DIRECTION_PICKER_PIN);
    int speed = analogRead(SPEED_SENSOR_PIN);

    int headlights = digitalRead(HEADLIGHTS_PICKER_PIN);
    int flashLeft = digitalRead(FLASH_LEFT_PICKER_PIN);
    int flashRight = digitalRead(FLASH_RIGHT_PICKER_PIN);
    int wiper = digitalRead(WIPER_PICKER_PIN);

    int boomUp = digitalRead(BOOM_UP_PICKER_PIN);
    int boomDown = digitalRead(BOOM_DOWN_PICKER_PIN);

    int boomLeft = digitalRead(BOOM_LEFT_PICKER_PIN);
    int boomRight = digitalRead(BOOM_RIGHT_PICKER_PIN);

    int boomElbowOut = digitalRead(BOOM_ELBOW_OUT_PICKER_PIN);
    int boomElbowIn = digitalRead(BOOM_ELBOW_IN_PICKER_PIN);

    analogWrite(DIRECTION_PIN, direction);
    digitalWrite(HEADLIGHTS_PIN, headlights);

    if ((millis() - boomTimer) >= 20)
    {
        if (boomUp)
        {
            boomElevationState = min(boomElevationState + 1, 255);
        }
        else if (boomDown)
        {
            boomElevationState = max(boomElevationState - 1, 0);
        }

        if (boomLeft)
        {
            boomRotationState = max(boomRotationState - 1, 0);
        }
        else if (boomRight)
        {
            boomRotationState = min(boomRotationState + 1, 255);
        }

        if (boomElbowOut)
        {
            boomElbowState = min(boomElbowState + 1, 255);
        }
        else if (boomElbowIn)
        {
            boomElbowState = max(boomElbowState - 1, 0);
        }

        analogWrite(BOOM_ELEVATION_PIN, boomElevationState);
        analogWrite(BOOM_ROTATION_PIN, boomRotationState);

        analogWrite(BOOM_ELBOW_PIN, boomElbowState);

        // Boom wrist is synchronized with elevation to keep it level
        analogWrite(BOOM_WRIST_PIN, boomElevationState);

        boomTimer = millis();
    }

    if ((millis() - flashTimer) >= 500)
    {
        flashState = !flashState;
        digitalWrite(FLASH_LEFT_PIN, flashLeft && flashState);
        digitalWrite(FLASH_RIGHT_PIN, flashRight && flashState);

        flashTimer = millis();
    }

    if (wiperState == 255)
    {
        wiperTarget = 0;
    }

    if (wiper)
    {
        if (wiperState == 0)
        {
            wiperTarget = 255;
        }
    }

    if ((millis() - wiperTimer) >= 10)
    {
        if (wiperState < wiperTarget)
        {
            wiperState = min(wiperState + 5, wiperTarget);
        }
        else if (wiperState > wiperTarget)
        {
            wiperState = max(wiperState - 5, wiperTarget);
        }

        digitalWrite(WIPER_PIN, wiperState);

        wiperTimer = millis();
    }

    if (millis() - timer > 100)
    {
        if (motorPower < gasPedal)
        {
            motorPower = min(motorPower + 10, gasPedal);
        }
        else if (motorPower > gasPedal)
        {
            motorPower = max(motorPower - 10, gasPedal);
        }
        timer = millis();
    }

    // Printing 4 times per second because printing every loop will
    // slow down the simulation.
    if ((millis() - printTimer) > 250)
    {
        // Sending everything as one print
        // because it's faster than sending
        // each value separately.

        String message = "";

        message += "Gas Pedal: ";
        message += gasPedal;
        message += ", ";

        message += "Direction: ";
        message += direction ? "Forward" : "Backward";
        message += ", ";

        message += "Speed: ";
        message += speed;
        message += ", ";

        message += "Motor Power: ";
        message += motorPower;
        message += ", ";

        Serial.println(message);

        printTimer = millis();
    }

    analogWrite(MOTOR_POWER_PIN, motorPower);
    analogWrite(SPEEDOMETER_PIN, speed);
}
