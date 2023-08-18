import { NavLink } from "react-router-dom"
import { RmendType } from "../types"
import { FormEvent, useContext, useState } from "react"
import { UserContext } from "../contexts/UserProvider"
import { RmendContext } from "../contexts/RmendProvider"
import { GoTrash } from "react-icons/go"
import StyledRating from '@mui/material/Rating';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MediaTypeIcon from "./MediaTypeIcon"

interface Rmendable {
    rmend: RmendType,
    removeRmendFromPage?(rmend: RmendType): void
}

function Rmend({ rmend, removeRmendFromPage }: Rmendable) {

    const { user } = useContext(UserContext)
    const { deleteRmend } = useContext(RmendContext)

    const [ error, setError] = useState('')

    async function handleDeleteRmend(e :FormEvent){
        e.preventDefault();
        console.log(rmend.rmend_id);
        const data = await deleteRmend(rmend);
        if(data === 'ok'){
            removeRmendFromPage!(rmend)
        } else {
            setError('rMEND could not be deleted')
        }
    }

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
                        <span>{ rmend.username }</span>
                        </NavLink>  <span> rMENDS </span>
                        <NavLink to={`/media/${rmend.media.type}/${rmend.media.mediaID}`} >
                            <span>{ rmend.media.title } ({ rmend.media.year })</span>
                        </NavLink> <span><MediaTypeIcon type={rmend.media.type} /></span>
                    </h3>
                    <h4>for <NavLink  className='rmend-for-movie-title' to={`/media/${rmend.rmendForType}/${rmend.rmendForMediaId}`}>{ rmend.rmendForTitle }</NavLink> <MediaTypeIcon type={rmend.rmendForType} /> </h4>
                    <p> "{ rmend.body }" </p>
                    <StyledRating
                        name="customized-color"
                        defaultValue={2}
                        getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                        precision={0.5}
                        icon={<Favorite fontSize="inherit" htmlColor='palevioletred' />}
                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                        value={Number(rmend.userRating)}
                        readOnly={true}
                    />
                    <p>Genres: { rmend.media.genre.map((genre, i) => <span key={i} className="genre" >#{genre.toLowerCase()} </span>) }</p>
                    <p className="error">{ error }</p>
                </div>
                <div className="rmend-delete-btn">
                    { user.username === rmend.username ? <button onClick={handleDeleteRmend} className="rmend-trash-btn" ><GoTrash /></button> : <span /> }
                </div>
            </div>    
        </div>
  )
}

export default Rmend