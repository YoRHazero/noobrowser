import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ConnectionState {
    backendUrl: string;
    username: string;
    isConnected: boolean;
    setBackendUrl: (url: string) => void;
    setUsername: (name: string) => void;
    setIsConnected: (connected: boolean) => void;
    reset: () => void;
}

const useConnectionStore = create<ConnectionState>()(
    persist(
        (set) => ({
            backendUrl: '',
            username: '',
            isConnected: false,
            setBackendUrl: (url: string) => set({ backendUrl: url }),
            setUsername: (name: string) => set({ username: name }),
            setIsConnected: (connected: boolean) => set({ isConnected: connected }),
            reset: () => set({ backendUrl: '', username: '', isConnected: false }),
        }),
        {
            name: 'connection-storage', // name of the item in storage
            storage: createJSONStorage(() => localStorage), // use localStorage
        }, 
    )
)

export { useConnectionStore }