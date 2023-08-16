import { MediaType } from "../types"
import { MdLocalMovies } from "react-icons/md"
import { PiTelevisionSimpleFill } from "react-icons/pi"
import { TbVinyl } from "react-icons/tb"
import { FaGamepad } from "react-icons/fa"
import { BiPodcast } from "react-icons/bi"

interface Mediable {
    media: MediaType,
    children?: JSX.Element | JSX.Element[]
}


function Media({ media, children }: Mediable) {

    return (
        <div className="media">
            <div className="media-display">
                <div>
                    <img src={ media.img } alt={media.title} className="media-img" />
                </div>
                <div className="media-info">
                    <h3>{ media.title } ({ media.year })</h3>
                    <p>Type:
                        { media.type === 'movie' ? <MdLocalMovies className='media-type-icon' /> : '' }
                        { media.type === 'tv' ? <PiTelevisionSimpleFill className='media-type-icon' /> : '' }
                        { media.type === 'album' ? <TbVinyl className='media-type-icon' /> : '' }
                        { media.type === 'game' ? <FaGamepad className='media-type-icon' /> : '' }
                        { media.type === 'podcast' ? <BiPodcast className='media-type-icon' /> : '' }
                    </p>
                    <p>Description: </p> 
                    <p className="media-description-indent">{ media.description }</p>
                    <p>Genres: { media.genre.map((gen) => <span>#{gen} </span>) }</p>
                </div>
            </div> 
            { children }
        </div>
    )
}

export default Media