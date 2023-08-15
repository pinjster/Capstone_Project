import { useContext } from "react"
import { UserContext } from "../contexts/UserProvider"
import Body from "../component/Body"
import Searchbar from "../component/Searchbar"


export default function MainPage(){
    
    const { user } = useContext(UserContext)

    return (
        <Body navbar footer>
            <h1>rMEND: your recommendations are here</h1>
            { user.logged ? <p>Logged in as { user.username }</p> : <p>Not Logged In</p> }
            <Searchbar />
        </Body>
    )
};
