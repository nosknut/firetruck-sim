import { writable } from "svelte/store";

function createToasts() {
    const { subscribe, update } = writable<{ id: string, message: string }[]>([]);

    return {
        subscribe,
        add(message: string) {
            update((messages) => ([
                ...messages,
                { id: Math.random().toString(), message }
            ]));
        },
        remove(id: string) {
            update((messages) => messages.filter((message) => message.id !== id));
        },
    };
}

export const toasts = createToasts();
