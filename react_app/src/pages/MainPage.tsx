import { useContext } from "react"
import Body from "../component/Body"
import Searchbar from "../component/Searchbar"
import Media from "../component/Media"
import { MediaContext } from "../contexts/MediaProvider"


export default function MainPage(){
    
    const { medias } = useContext(MediaContext)

    return (
        <Body navbar footer>
            <div className="main-page-headers">
                <h1 className="main-page-h1" >rMEND: your recommendations are here</h1>
                <h4 className="main-page-h4">Find recommendations from all over for various forms of medias</h4>
                <h4 className="main-page-h4">Recommend medias for other forms of media such as Books, Movies, Shows, Albums, Games, and Podcasts</h4>
                <h5>ie. search Breaking Bad and recommend Better Call Saul..</h5>
                <h6>It's all here</h6>
            </div>
            <div className="main-searchbar">
                <Searchbar />
            </div>
            <div className="main-page-results">
                { medias.length > 0 ? medias.map((media, i) => <Media media={media} key={i} /> ) : '' }
            </div>
        </Body>
    )
};
