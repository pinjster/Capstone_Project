import { BiPodcast } from "react-icons/bi"
import { FaGamepad } from "react-icons/fa"
import { MdLocalMovies } from "react-icons/md"
import { PiTelevisionSimpleFill } from "react-icons/pi"
import { TbVinyl } from "react-icons/tb"


function MediaTypeIcon({ type }: { type: string}) {
  return (
    <span>
        { type === 'movie' ? <MdLocalMovies className='media-type-icon' /> : '' }
        { type === 'tv' ? <PiTelevisionSimpleFill className='media-type-icon' /> : '' }
        { type === 'album' ? <TbVinyl className='media-type-icon' /> : '' }
        { type === 'game' ? <FaGamepad className='media-type-icon' /> : '' }
        { type === 'podcast' ? <BiPodcast className='media-type-icon' /> : '' }
    </span>
  )
}

export default MediaTypeIcon