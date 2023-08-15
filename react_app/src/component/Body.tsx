import Navbar from "./Navbar"
import Footer from "./Footer"

interface BodyProps {
    navbar?: boolean,
    footer?: boolean,
    children: JSX.Element | JSX.Element[]
}

export default function Body({navbar, footer, children}: BodyProps) {
    
    return (
        <div className="body-component">
            { navbar && <Navbar />}
            {children}
            { footer && <Footer /> }
        </div>
    )
}