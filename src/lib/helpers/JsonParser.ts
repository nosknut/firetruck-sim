export function JsonParser() {
    let json = "";
    let numCurlyBraces = 0;

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

    function parseChar(char: string): object | null {
        if (numCurlyBraces < 0) {
            json = "";
            numCurlyBraces = 0;
            return null;
        }

        if (numCurlyBraces === 0) {
            if (char !== "{") {
                if (json.length > 0) {
                    json = "";
                }
                return null;
            }
        }

        if (char === "{") {
            numCurlyBraces += 1;
        }

        if (char === "}") {
            numCurlyBraces -= 1;
        }

        json += char;

        if (numCurlyBraces === 0) {
            const content = JSON.parse(json);
            json = "";
            return content;
        }

        return null;
    }

    return {
        parse,
        parseChar,
    }
}
