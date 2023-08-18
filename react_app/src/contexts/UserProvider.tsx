import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react"
import { CurrentUser, RmendType, UserType } from "../types"

// rfce: 

interface UserContextValues {
    user: CurrentUser,
    setUser:  Dispatch<SetStateAction<CurrentUser>>,
    following: string[],
    setFollowing: Dispatch<SetStateAction<string[]>>,
    getUserProfile: (username:string) => Promise<UserType | undefined>,
    followUser: (username: string) => Promise<string>,
    unfollowUser: (username: string) => Promise<string>,
    setRmend: (data: any) => RmendType
}

export const UserContext = createContext({} as UserContextValues)
export default function UserProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
    
    const [user, setUser] = useState<CurrentUser>({username: '', accessToken: '', logged: false})
    const [following, setFollowing] = useState<string[]>([])
    
    const baseAPI: string = import.meta.env.VITE_APP_BASE_API

    const value = {
        user,
        setUser,
        following,
        setFollowing,
        getUserProfile,
        followUser,
        unfollowUser,
        setRmend
    }

    function setRmend(data: any): RmendType {
        const genres: string[] = []
        for(let genre of data.genres){
            genres.push(genre)
        }
        const rmend = {
            rmend_id: data.rmend_id,
            media: {
                title: data.media.title,
                year: data.media.year,
                mediaID: data.media.media_id,
                type: data.media.type,
                description: data.media.description,
                author: '',
                img: data.media.img,
                genre: genres
            },
            username: data.username,
            body: data.body,
            userRating: data.user_rating,
            dateAdded: data.date_added,
            rmendForTitle: data.rmend_for.for_title || '',
            rmendForType: data.rmend_for.for_type || '',
            rmendForMediaId: data.rmend_for.for_media_id || -1,
            totalLikes: data.total_likes,
        }
        return rmend
    }

    async function getUserProfile(username: string): Promise<UserType | undefined> {
        const res = await fetch(`${baseAPI}/user/profile/${username}`,{
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(res.ok){
            const data = await res.json()
            const followers = [];
            const following = [];
            const rmends = [];
            for(let follower of data.followers){
                followers.push(follower.username);
            }
            for(let follow of data.following){
                following.push(follow.username);
            }
            for(let rmend of data.rmends){
                rmends.push(setRmend(rmend))
            }
            const u: UserType = {
                username: data.username,
                email: data.email,
                followerCount: data.follower_count,
                followers: followers,
                followingCount: data.following_count,
                following: following,
                joined: data.joined,
                rmends: rmends,
            }
            return u;
        } else {
            return undefined
        }
    }

    async function followUser(username: string): Promise<string> {
        const res = await fetch(`${baseAPI}/user/follow/${username}`,{
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${user.accessToken}`,
            }
        });
        if(res.ok){
            return 'ok';
        } else if(res.status === 409) {
            return res.statusText
        } else {
            return 'bad'
        }
    }

    async function unfollowUser(username: string): Promise<string> {
        const res = await fetch(`${baseAPI}/user/unfollow/${username}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${user.accessToken}`,
            }
        });
        if(res.ok){
            return 'ok';
        } else if(res.status === 409) {
            return res.statusText
        } else {
            return 'bad'
        }
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
