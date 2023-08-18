import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../contexts/UserProvider'


interface Followable {
    selectUser: string
}


function FollowButton({ selectUser }: Followable) {

    const { user, following, setFollowing, followUser, unfollowUser } = useContext(UserContext)
    const [ follow, setFollow ] = useState('')

    async function handleFollowing(){
        if(follow === 'follow'){
            const res = await followUser(selectUser);
            if(res === 'ok'){
                setFollowing([ selectUser, ...following]);
                setFollow('unfollow');
            }
        } else if(follow === 'unfollow'){
            const res = await unfollowUser(selectUser);
            if(res === 'ok'){
                const newFollowing = following.filter((u) => { u !== selectUser });
                setFollowing(newFollowing);
                setFollow('follow');
            }
        }
    }

    useEffect(() => {
        if(following.includes(selectUser)){
            setFollow('unfollow')
        } else {
            setFollow('follow')
        }
    },[selectUser])

  return (
    <div>
        { user.username === selectUser ? <span /> : user.logged ? <button onClick={handleFollowing} >{ follow }</button> : <span /> }
    </div>
  )
}

export default FollowButton