export function onEnter<T extends KeyboardEvent>(cb: (e: T) => void) {
    return function (e: T) {
        if (e.key === 'Enter') {
            cb(e)
        }
    }
}
