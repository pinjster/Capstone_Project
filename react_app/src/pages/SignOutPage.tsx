import { useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserProvider"
import { useNavigate } from "react-router-dom"
import Body from "../component/Body"

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
    <Body>
      <h1>Sign Out</h1>
    </Body>
  )
}

export default SignOutPage