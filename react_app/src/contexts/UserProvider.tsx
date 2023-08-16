import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react"
import { CurrentUser } from "../types"

// rfce: 

interface UserContextValues {
    user: CurrentUser,
    setUser:  Dispatch<SetStateAction<CurrentUser>>
}

export const UserContext = createContext({} as UserContextValues)
export default function UserProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
    const [user, setUser] = useState<CurrentUser>({username: '', accessToken: '', logged: false})

    const value = {
        user,
        setUser
    }

    useEffect(() => {
        const localUser = localStorage.getItem("localUser");
        const localToken = localStorage.getItem("localToken");
        if(localUser && localToken){
            setUser({
                logged: true,
                username: JSON.parse(localUser),
                accessToken: JSON.parse(localToken)
            });
        }
    }, []);

    return (
        <UserContext.Provider value={value}>
            { children }
        </UserContext.Provider>
    )
};
