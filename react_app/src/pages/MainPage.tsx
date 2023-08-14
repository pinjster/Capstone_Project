import { useContext } from "react"
import { UserContext } from "../contexts/UserProvider"


export default function MainPage(){
    
    const { user } = useContext(UserContext)

    return (
        <div>
            <h1>rMEND: your recommendations are here</h1>
            { user.logged ? <p>Logged in as { user.username }</p> : <p>Not Logged In</p> }
        </div>
    )
};
