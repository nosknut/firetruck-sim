#include "FiretruckSim.h"

const int GAS_PEDAL_PIN = 1;
const int DIRECTION_PIN = 2;
const int SPEED_SENSOR_PIN = 3;
const int DIRECTION_INDICATOR_PIN = 4;
const int MOTOR_POWER_PIN = 5;
const int SPEEDOMETER_PIN = 6;

unsigned long timer = 0;

void setup()
{
    Serial.begin(115200);

    pinMode(GAS_PEDAL_PIN, INPUT);
    pinMode(DIRECTION_PIN, INPUT);
    pinMode(SPEED_SENSOR_PIN, INPUT);

    pinMode(DIRECTION_INDICATOR_PIN, OUTPUT);
    pinMode(MOTOR_POWER_PIN, OUTPUT);
    pinMode(SPEEDOMETER_PIN, OUTPUT);
}

int motorPower = 0;

void loop()
{
    int gasPedal = analogRead(GAS_PEDAL_PIN);
    int direction = analogRead(DIRECTION_PIN);
    int speed = analogRead(SPEED_SENSOR_PIN);

    analogWrite(DIRECTION_INDICATOR_PIN, direction);

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

        Serial.print("Gas Pedal: ");
        Serial.print(gasPedal);
        Serial.print(", ");

        Serial.print("Direction: ");
        Serial.print(direction ? "Forward" : "Backward");
        Serial.print(", ");

        Serial.print("Speed: ");
        Serial.print(speed);
        Serial.print(", ");

        Serial.print("Motor Power: ");
        Serial.print(motorPower);

        Serial.println("");

        timer = millis();
    }

    analogWrite(MOTOR_POWER_PIN, motorPower);
    analogWrite(SPEEDOMETER_PIN, speed);
}
