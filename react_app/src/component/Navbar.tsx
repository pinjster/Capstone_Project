import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { UserContext } from "../contexts/UserProvider"

export default function Navbar() {
    
    const { user } = useContext(UserContext)

    return (
        <ul className="navbar-list">
            <li><NavLink to="/">Home</NavLink></li>
            { user.logged ? <li><NavLink to="/my-profile">{ user.username }'s Profile</NavLink></li> : '' }
            { !user.logged ? <li><NavLink to="/sign-in">Sign In</NavLink></li> : '' }
            { !user.logged ? <li><NavLink to="/sign-up">Sign Up</NavLink></li> : '' }
            { user.logged ? <li><NavLink to="/sign-out">Sign Out</NavLink></li> : '' }
        </ul>
    )
};
