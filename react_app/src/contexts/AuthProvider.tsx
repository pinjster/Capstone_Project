// Import the functions you need from the SDKs you need
import { createContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Auth, 
    createUserWithEmailAndPassword, 
    UserCredential,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
    } from "firebase/auth/cordova";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

interface AuthContextValues {
    auth: Auth,
    authSignUp: (email: string, password: string) => Promise<UserCredential>
    authSignIn(email: string, password: string): Promise<UserCredential>
    authSignOut(): Promise<void>
}


export const AuthContext = createContext({} as AuthContextValues)
export default function AuthProvider({ children }: { children: JSX.Element | JSX.Element[] }){

    const [ user, setUser ] = useState({})

    const firebaseConfig = {
        apiKey: import.meta.env.FIREBASE_API_KEY,
        authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.FIREBASE_APP_ID
    };
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    function authSignUp(email: string, password: string): Promise<UserCredential> {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function authSignIn(email: string, password: string): Promise<UserCredential> {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function authSignOut(): Promise<void> {
        return signOut(auth);
    }

    const value = {
        auth,
        authSignIn,
        authSignUp,
        authSignOut,
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(user);
            setUser(currentUser!)
        })
        return () => {
            unsubscribe()
        }
    },[])

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )

}