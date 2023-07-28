#include "FiretruckSim.h"

unsigned long timer = 0;
bool state = false;

void setup()
{
    Serial.begin(115200);
}

int i = 0;
void loop()
{
    /*
    for (int x = 0; x < 255; x++)
    {
        digitalWrite(6, x);
        delay(10);
    }
    for (int x = 255; x > 0; x--)
    {
        digitalWrite(6, x);
        delay(10);
    }
    */
    delay(1000);
    Serial.print("Hello World!" + String(i++));
}
