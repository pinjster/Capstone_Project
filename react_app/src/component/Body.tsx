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
            <div className="body-children">
                {children}
            </div>
            { footer && <Footer /> }
        </div>
    )
}