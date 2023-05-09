export function matchQuote(str: string, left: string, right: string) {
    let stack = 0;
    let start = -1;
    let end = -1;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === left) {
            if (stack === 0) {
                start = i;
            }
            stack++;
        }
        if (str[i] === right) {
            stack--;
            if (stack === 0) {
                end = i;
                break;
            }
        }
    }
    if (start !== -1 && end !== -1) {
        return str.substring(start, end + 1);
    }
    return null;
}

export function getValidVegaSpec (content: string): object | null {
    const raw = matchQuote(content, '{', '}');
    if (raw) {
        try {
            const spec = JSON.parse(raw);
            return spec
        } catch (e) {
            return null
        }
    }
    return null;
}