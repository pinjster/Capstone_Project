import { NavLink } from "react-router-dom";


export default function Footer(){


    return(
        <div className="footer-component">
            <h6>By Benjamin Copen</h6>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/sign-in">Sign In</NavLink></li>
                <li><NavLink to="/sign-up">Sign Up</NavLink></li>
                <li><NavLink to="/sign-out">Sign Out</NavLink></li>
                <li><NavLink to="/my-profile">My Profile</NavLink></li>
            </ul>
        </div>
    )
}