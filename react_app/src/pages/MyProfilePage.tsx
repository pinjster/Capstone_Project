import { useState, useContext, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { UserContext } from "../contexts/UserProvider";
import Body from "../component/Body";
import Rmend from "../component/Rmend";
import { RmendType, UserType } from "../types";


function MyProfilePage(){
  
    const { user, getUserProfile } = useContext(UserContext);
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
        const currUser = await getUserProfile(user.username)
        if(typeof currUser != 'undefined'){
            setU(currUser);
            setFollowing(currUser.following);
            setFollowers(currUser.followers);
            setRmends(currUser.rmends);
        }
    }

    function removeRmendFromPage(rmend: RmendType){
        console.log(rmend.rmend_id);
        const new_rmends = rmends.filter((eachRmend) => {
            return eachRmend.rmend_id !== rmend.rmend_id 
        })
        setRmends(new_rmends)
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
        <h3>Total Followers: <span>{u.followerCount}</span></h3>
        <ul>
            { followers.map((user, i) => <li key={i} ><NavLink to={`/${user}/profile`} >{user}</NavLink></li>) }
        </ul>
        <h3>Total Following: <span>{u.followingCount}</span></h3>
        <ul>
            { following.map((user, i) => <li key={i} ><NavLink to={`/${user}/profile`} >{user}</NavLink></li>) }
        </ul>
        <h3>Your rMENDS</h3>
        <ul>
            { rmends.map((rmend, i) => <li key={i} ><Rmend rmend={rmend} removeRmendFromPage={removeRmendFromPage} ></Rmend></li>) }
        </ul>

    </Body>
  )
}

export default MyProfilePage