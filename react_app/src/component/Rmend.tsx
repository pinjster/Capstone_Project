import { NavLink } from "react-router-dom"
import { RmendType } from "../types"
import { MdLocalMovies } from "react-icons/md"
import { PiTelevisionSimpleFill } from "react-icons/pi"
import { TbVinyl } from "react-icons/tb"
import { FaGamepad } from "react-icons/fa"
import { BiPodcast } from "react-icons/bi"


interface Rmendable {
    rmend: RmendType,
}

function Rmend({ rmend }: Rmendable) {

    return (
        <div className="rmend">
            <div className="rmend-display">
                <div>
                    <NavLink to={`/media/${rmend.media.type}/${rmend.media.mediaID}`}>
                        <img src={ rmend.media.img } alt={rmend.media.title} className="rmend-img" />
                    </NavLink>
                </div>
                <div className="rmend-info">
                    <h3><NavLink to={`/${rmend.username}/profile`}>
                        { rmend.username }
                        </NavLink> rMENDS
                        <NavLink to={`/media/${rmend.media.type}/${rmend.media.mediaID}`} >
                            { rmend.media.title } ({ rmend.media.year })
                        </NavLink>
                    </h3>
                    <p>Type:
                        { rmend.media.type === 'movie' ? <MdLocalMovies className='media-type-icon' /> : '' }
                        { rmend.media.type === 'tv' ? <PiTelevisionSimpleFill className='media-type-icon' /> : '' }
                        { rmend.media.type === 'album' ? <TbVinyl className='media-type-icon' /> : '' }
                        { rmend.media.type === 'game' ? <FaGamepad className='media-type-icon' /> : '' }
                        { rmend.media.type === 'podcast' ? <BiPodcast className='media-type-icon' /> : '' }
                    </p>
                    <p>Body: { rmend.body }</p>
                    <p>Genres: { rmend.media.genre.map((genre) => <span>#{genre} </span>) }</p>
                </div>
            </div>    
        </div>
  )
}

export default Rmend