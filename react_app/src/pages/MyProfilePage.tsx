import { useState, useContext, useEffect } from "react";
import Body from "../component/Body";
import { UserContext } from "../contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import { RmendType, UserType } from "../types";


function MyProfilePage(){
  
    const { user } = useContext(UserContext);
    const [ following, setFollowing ] = useState<string[]>([])
    const [ followers, setFollowers ] = useState<string[]>([])
    const [ rmends, setRmends ] = useState<RmendType[]>([])
    const [ u, setU ] = useState<UserType>({
        username: user.username,
        email: '',
        followerCount: 0,
        followers: followers,
        following: following,
        followingCount: 0,
        joined: '',
        rmends: rmends,
    });
    const nav = useNavigate();    

    async function getCurrentUserInfo(){
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_API}/user/profile/${user.username}`,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if(res.ok){
            const data = await res.json();
            for(let follow of data.followers){
                setFollowers([...followers, follow.username]),[]
            }
            for(let follow of data.following){
                setFollowing([...following, follow.username])
            }
            for(let rmend of data.rmends){
                setRmends([...rmends, rmend]),[]
            }
            setU({
                username: user.username,
                email: data.email,
                followerCount: data.follower_count,
                followers: followers,
                following: following,
                followingCount: data.following_count,
                joined: data.joined,
                rmends: rmends,
            })
        } else {
            console.log("ERROR");
        }
    }

    useEffect(() => {
        if(!user.logged){
            nav('/');
        } else {
            getCurrentUserInfo();
        }
    },[])
    

    return (
    <Body navbar footer>
        <h1>Your Profile</h1>
        <h3>Username: {user.username}</h3>
        <h3>email: {u.email}</h3>

        <h3>Your Followers:</h3>
        <ul>
            { followers.map((user) => <p>{user}</p>) }
        </ul>
        <h3>You're Following:</h3>
        <ul>
            { following.map((user) => <p>{user}</p>) }
        </ul>
        <h3>Your rMENDS</h3>
        <ul>
            { rmends.map(() => <p>Eee</p>) }
        </ul>

    </Body>
  )
}

export default MyProfilePage