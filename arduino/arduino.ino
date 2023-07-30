#include "FiretruckSim.h"

const int GAS_PEDAL_PIN = 1;
const int DIRECTION_PICKER_PIN = 2;
const int SPEED_SENSOR_PIN = 3;
const int DIRECTION_PIN = 4;
const int MOTOR_POWER_PIN = 5;
const int SPEEDOMETER_PIN = 6;

unsigned long timer = 0;
unsigned long printTimer = 0;

void setup()
{
    Serial.begin(115200);

    pinMode(GAS_PEDAL_PIN, INPUT);
    pinMode(DIRECTION_PICKER_PIN, INPUT);
    pinMode(SPEED_SENSOR_PIN, INPUT);

    pinMode(DIRECTION_PIN, OUTPUT);
    pinMode(MOTOR_POWER_PIN, OUTPUT);
    pinMode(SPEEDOMETER_PIN, OUTPUT);
}

int motorPower = 0;

void loop()
{
    int gasPedal = analogRead(GAS_PEDAL_PIN);
    int direction = analogRead(DIRECTION_PICKER_PIN);
    int speed = analogRead(SPEED_SENSOR_PIN);

    analogWrite(DIRECTION_PIN, direction);

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
