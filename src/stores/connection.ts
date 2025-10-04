import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ConnectionState {
    backendUrl: string;
    username: string;
    setBackendUrl: (url: string) => void;
    setUsername: (name: string) => void;
    reset: () => void;
}

const useConnectionStore = create<ConnectionState>()(
    persist(
        (set) => ({
            backendUrl: '',
            username: '',
            setBackendUrl: (url: string) => set({ backendUrl: url }),
            setUsername: (name: string) => set({ username: name }),
            reset: () => set({ backendUrl: '', username: '' }),
        }),
        {
            name: 'connection-storage', // name of the item in storage
            storage: createJSONStorage(() => localStorage), // use localStorage
        }, 
    )
)

export { useConnectionStore }