import {create} from "zustand"

interface User
{
    username:string
    name:string
    role:"citizen" | "officer"
    badge?: string
}

interface AuthStore
{
    user:User | null
    setUser: (user:User) => void
    logout: () => void
}

export const useAuthStore = create <AuthStore> ((set) => ({
    user:null,
    setUser:(user) => set({user}),
    logout: () =>set({user:null}),
}))