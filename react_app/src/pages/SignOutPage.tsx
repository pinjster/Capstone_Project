import { useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserProvider"
import { useNavigate } from "react-router-dom"

function SignOutPage() {

  const { setUser } = useContext(UserContext)
  const nav = useNavigate()

  useEffect(() => {
    setUser({
      logged: false,
      username: '',
      accessToken: ''
    });
    localStorage.removeItem("localUser");
    localStorage.removeItem("localToken");
    nav('/');
  })

  return (
    <div>SignOutPage</div>
  )
}

export default SignOutPage