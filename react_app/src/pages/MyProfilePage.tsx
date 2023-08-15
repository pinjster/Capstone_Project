import { useContext, useEffect } from "react";
import Body from "../component/Body";
import { UserContext } from "../contexts/UserProvider";
import { useNavigate } from "react-router-dom";

function MyProfilePage() {
  
    const { user } = useContext(UserContext);
    const nav = useNavigate();    

    useEffect(() => {
        if(!user.logged){
            nav('/')
        }
    })
    

    return (
    <Body navbar footer>
        <h1>Your Profile</h1>
    </Body>
  )
}

export default MyProfilePage