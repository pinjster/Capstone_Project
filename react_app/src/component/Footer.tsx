import { NavLink } from "react-router-dom";


export default function Footer(){


    return(
        <div className="footer-component">
            <hr />
            <h6>By Benjamin Copen</h6>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/user">Profile</NavLink></li>
                <li><NavLink to="/sign-in">Sign In</NavLink></li>
                <li><NavLink to="/sign-up">Sign Up</NavLink></li>
                <li><NavLink to="/my-feed">My Feed</NavLink></li>
            </ul>
        </div>
    )
}