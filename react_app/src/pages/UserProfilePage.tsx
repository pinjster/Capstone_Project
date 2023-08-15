import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { UserType } from "../types"

function UserProfilePage() {

    const { username } = useParams()
    const baseURL = import.meta.env.VITE_APP_BASE_API
    const [ user ] = useState<UserType | null>(null) 

    console.log(user); //IMPLEMENT

    useEffect(() => {
        const response = fetch(`${baseURL}/user/profile/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log(response); //FIX
    })

    return (
        <div>UserProfilePage</div>
  )
}

export default UserProfilePage