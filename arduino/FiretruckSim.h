#include <Arduino.h>

int pinValues[20] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

// https://theasciicode.com.ar/ascii-control-characters/eot-end-of-transmission-diamonds-card-suit-ascii-code-4.html
const char START_OF_HEADER = 1;
const char START_OF_TEXT = 2;
const char END_OF_TEXT = 3;
const char END_OF_TRANSMISSION = 4;
const char ACK = 6;

const char MODE_MESSAGE = 'm';
const char PIN_MESSAGE = 'p';
const char PIN_MESSAGE_SEP = ':';
const char PRINT_MESSAGE = 'w';

const char PIN_MODE_OUTPUT = 'o';
const char PIN_MODE_INPUT = 'i';

String buffer = "";

String getPinMessage(int pin, int val)
{
    return START_OF_HEADER + PIN_MESSAGE + String(pin) + PIN_MESSAGE_SEP + String(val) + END_OF_TRANSMISSION;
}

String getPrintMessage(String s)
{
    return START_OF_HEADER + PRINT_MESSAGE + s + END_OF_TRANSMISSION;
}

void parsePinMessage(String s, int &pin, int &val)
{ 
    pin = s.substring(2, s.indexOf(PIN_MESSAGE_SEP)).toInt();
    val = s.substring(s.indexOf(PIN_MESSAGE_SEP) + 1, s.length() - 1).toInt();

    Serial.println("Setting " + String(pin) + " to " + String(val));
}

{"p":10,"v":2}
sp10:2;
String parsePrintMessage(String s)
{
    return s.substring(1, s.length() - 1);
}

void syncPinsWithSim()
{
    while (Serial.available() > 0)
    {
        char c = Serial.read();

        if (c == START_OF_HEADER)
        {
            buffer = "";
        }

        buffer += c;

        if (c == END_OF_TRANSMISSION && buffer.length() > 2)
        {
            char messageType = buffer[1];

            if (messageType == PIN_MESSAGE)
            {
                int pin, val;
                parsePinMessage(buffer, pin, val);

                Serial.println(pin);
                Serial.println(val);
                pinValues[pin] = val;
            }
            else if (messageType == PRINT_MESSAGE)
            {
                String s = parsePrintMessage(buffer);
                Serial.println(s);
            }
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

    Serial.print(getPinMessage(pin, val));

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
    Serial.print(getPrintMessage(s));
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
        return printSim(s);
    }

    size_t println(const String &s)
    {
        return printlnSim(s);
    }
};

HardwareSerialSim SerialSim;

#define Serial SerialSim
