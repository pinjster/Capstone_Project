import { useEffect, useState, useContext } from "react"
import { useParams, NavLink, useNavigate } from "react-router-dom"
import { UserType } from "../types"
import Body from "../component/Body"
import { UserContext } from "../contexts/UserProvider"

function UserProfilePage() {

    const { username } = useParams()
    const { user, getUserProfile } = useContext(UserContext)
    const [ searchedUser, setSearchedUser ] = useState<UserType | undefined>(undefined) 
    const nav = useNavigate()

    async function UserProfile(username: string){
        const u = await getUserProfile(username);
        if(typeof u != 'undefined'){
            setSearchedUser((user) => { return user = u})
        }
    }

    useEffect(() => {
        if(typeof username != 'undefined'){
            if(username === user.username){
                nav("/my-profile");
            }
        }
    })

    useEffect(() => {
        if(typeof username != 'undefined'){
            UserProfile(username);
        }
    },[])

    return (
        <Body navbar footer>
            {typeof searchedUser == 'undefined' ? <p>user does not exist</p> : 
                <div>
                    <h1>{ searchedUser.username }'s Page</h1>
                    <h3>email: {searchedUser.email}</h3>
                    <h3>Total Followers: <span>{searchedUser.followerCount}</span></h3>
                    <ul>
                        { searchedUser.followers.map((user, i) => <p key={i} ><NavLink to={`/${user}/profile`} >{user}</NavLink></p>) }
                    </ul>
                    <h3>Total Following: <span>{searchedUser.followingCount}</span></h3>
                    <ul>
                        { searchedUser.following.map((user, i) => <li key={i} ><NavLink to={`/${user}/profile`} >{user}</NavLink></li>) }
                    </ul>
                    <h3>{ searchedUser.username }'s rMENDS</h3>
                    <ul>
                        { searchedUser.rmends.map((rmend, i) => <p key={i} >{rmend.body}</p>) }
                    </ul>
                </div>
            }
        </Body>
  )
}

export default UserProfilePage