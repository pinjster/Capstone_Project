import Navbar from "./Navbar"
import Footer from "./Footer"

interface BodyProps {
    navbar: boolean,
    children: JSX.Element | JSX.Element[]
}

export default function Body({navbar, children}: BodyProps) {
    
    return (
        <div className="body-component">
            { navbar && <Navbar />}
            {children}
            { <Footer /> }
        </div>
    )
}