import { createContext, useContext, useEffect, useState } from 'react'
import {type User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase.tsx'

type AuthContextType = {
    user: User | null
}

const AuthContext = createContext<AuthContextType>({ user: null })

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser)
        return () => unsubscribe()
    }, [])

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}
