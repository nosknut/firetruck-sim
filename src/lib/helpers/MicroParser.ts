// https://theasciicode.com.ar/ascii-control-characters/eot-end-of-transmission-diamonds-card-suit-ascii-code-4.html
const START_OF_HEADER = String.fromCharCode(1);
// const START_OF_TEXT = String.fromCharCode(2);
// const END_OF_TEXT = String.fromCharCode(3);
const END_OF_TRANSMISSION = String.fromCharCode(4);
// const ACK = String.fromCharCode(6);

// const MODE_MESSAGE = 'm';
const PIN_MESSAGE = 'p';
const PIN_MESSAGE_SEP = ':';

const PRINT_MESSAGE = 'w';
// const PIN_MODE_OUTPUT = 'o';
// const PIN_MODE_INPUT = 'i';

export function createPinMessage(pin: number, val: number) {
    return START_OF_HEADER + PIN_MESSAGE + String(pin) + PIN_MESSAGE_SEP + String(val) + END_OF_TRANSMISSION;
}

export function createPrintMessage(s: string) {
    return START_OF_HEADER + PRINT_MESSAGE + s + END_OF_TRANSMISSION;
}

function parsePinMessage(s: string) {
    const pin = Number(s[1]);
    const val = Number(s[2]);
    return { pin, val };
}

function parsePrintMessage(s: string) {
    return s.substring(1, s.length - 1);
}

export function MicroParser() {
    let buffer = "";

    function parse(data: string) {
        const contents: Array<object> = []
        for (const char of data) {
            const content = parseChar(char);
            if (content) {
                contents.push(content);
            }
        }
        return contents;
    }

    function parseChar(c: string): object | null {
        console.log("c")

        if (c === START_OF_HEADER) {
            buffer = "";
        }

        buffer += c;

        if (c === END_OF_TRANSMISSION && buffer.length > 2) {
            const messageType = buffer[1];
            if (messageType === PIN_MESSAGE) {
                return parsePinMessage(buffer);
            }
            else if (messageType === PRINT_MESSAGE) {
                return {
                    print: parsePrintMessage(buffer)
                };
            }
        }

        return null
    }

    return {
        parse,
        parseChar,
    }
}
