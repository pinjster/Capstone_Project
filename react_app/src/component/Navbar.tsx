import { NavLink } from "react-router-dom"

export default function Navbar() {
    
    return (
        <ul className="navbar">
            <li><NavLink to="/">Home</NavLink></li>
        </ul>
    )
};
