#include "FiretruckSim.h"

unsigned long timer = 0;
bool state = false;

void setup()
{
    Serial.begin(115200);
}

void loop()
{
    int value = analogRead(3);
    analogWrite(5, value);

    if (millis() - timer > 1000)
    {
        timer = millis();
        Serial.println("Hello, world!");
        analogWrite(6, state ? 255 : 0);
        state = !state;
    }

    delay(100);
}
