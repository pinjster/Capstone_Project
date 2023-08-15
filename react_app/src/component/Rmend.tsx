import { MediaType } from "../types"

interface Rmendable {
    media: MediaType,
    edit?: boolean,
    add?: boolean
}

function Rmend({ media, edit, add }: Rmendable) {

    const movieURL = "https://image.tmdb.org/t/p/w500/"



  return (
    <div className="rmend">
        <div className="rmend-display">
            <div>
                <img src={ movieURL + media.img } alt={media.title} className="rmend-img" />
            </div>
            <div className="rmend-info">
                <h3>{ media.title } ({ media.year })</h3>
                <p>Type: { media.type }</p>
                <p>Description: { media.description }</p>
                <p>Genres: { media.genre.map((gen) => <span>#{gen} </span>) }</p>
            </div>
        </div>    
        <div>
            { edit ? 
            <form>
                <input type="button" value="Press Me" />
            </form> : ''}
            { add ? 
            <form action=""></form> : ''
            }
        </div>
    </div>
  )
}

export default Rmend