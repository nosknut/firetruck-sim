#include <Arduino.h>
#include <ArduinoJson.h>

int pinValues[20] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

void syncPinsWithSim()
{
    while (Serial.available() > 0)
    {
        DynamicJsonDocument jsonDoc(500);
        DeserializationError error = deserializeJson(jsonDoc, Serial);

        if (error != DeserializationError::Ok)
        {
            Serial.print("deserializeJson() failed: ");
            Serial.println(error.c_str());
            return;
        }

        if (jsonDoc.containsKey("p"))
        {
            int pin = jsonDoc["p"].as<int>();
            int value = jsonDoc["v"].as<int>();
            pinValues[pin] = value;
        }
    }
}

int digitalReadSim(uint8_t pin)
{
    syncPinsWithSim();
    return pinValues[pin];
}

int analogReadSim(uint8_t pin)
{
    syncPinsWithSim();
    return pinValues[pin];
}

void analogWriteSim(uint8_t pin, int val)
{
    syncPinsWithSim();

    if (val == pinValues[pin])
    {
        return;
    }

    pinValues[pin] = val;

    DynamicJsonDocument jsonDoc(500);

    jsonDoc["p"] = pin;
    jsonDoc["v"] = val;

    serializeJson(jsonDoc, Serial);
    syncPinsWithSim();
}

void digitalWriteSim(uint8_t pin, uint8_t val)
{
    analogWriteSim(pin, val);
}

#define digitalRead digitalReadSim
#define analogRead analogReadSim
#define digitalWrite digitalWriteSim
#define analogWrite analogWriteSim

size_t printSim(const String &s)
{
    syncPinsWithSim();

    DynamicJsonDocument jsonDoc(500);
    jsonDoc["print"] = s;

    // return serializeJson(jsonDoc, *this);
    serializeJson(jsonDoc, Serial);
}

size_t printlnSim(const String &s)
{
    return printSim(s + '\n');
}

class HardwareSerialSim
{
public:
    void begin(unsigned long baudrate)
    {
        Serial.begin(baudrate);
    }

    size_t print(const String &s)
    {
        syncPinsWithSim();

        DynamicJsonDocument jsonDoc(500);
        jsonDoc["print"] = s;

        return serializeJson(jsonDoc, Serial);
    }

    size_t println(const String &s)
    {
        return print(s + '\n');
    }
};

HardwareSerialSim SerialSim;

#define Serial SerialSim
