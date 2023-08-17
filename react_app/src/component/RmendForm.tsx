import { Typography } from '@mui/material';
import StyledRating from '@mui/material/Rating';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState, useRef, FormEvent, useContext } from 'react';
import { MediaType, RmendType } from '../types';
import { MediaContext } from '../contexts/MediaProvider';
import { UserContext } from '../contexts/UserProvider';
import { RmendContext } from '../contexts/RmendProvider';

interface RmendFormable {
    rmendFor: MediaType
}

function RmendForm({ rmendFor }: RmendFormable) {
    
        const { searchByTitle } = useContext(MediaContext)
        const { user } = useContext(UserContext)
        const { addRmend } = useContext(RmendContext)

    const rmendTitleForm = useRef<HTMLInputElement>(null);
    const rmendTypeForm = useRef<HTMLSelectElement>(null);
    const bodyForm = useRef<HTMLTextAreaElement>(null);
    const genreForm = useRef<HTMLInputElement>(null);

    const [ rating, setRating ] = useState<number | null>(2.5)
    const [ mediaResult, setMediaResult ] = useState<MediaType | string>('')
    
    
    async function submitRmend(e: FormEvent){
        e.preventDefault();
        if(typeof mediaResult != 'string' && rating){
            if(rmendFor.genre.length <= 0){
                rmendFor.genre.push('')
            }
            const newRmend: RmendType = {
                rmend_id: -1,
                media: rmendFor,
                username: user.username,
                body: bodyForm.current!.value,
                userRating: rating,
                dateAdded: '',
                rmendForTitle: mediaResult.title,
                rmendForType: mediaResult.type,
                rmendForMediaId: mediaResult.mediaID,
                totalLikes: 0,
            }
            console.log(newRmend);
            const response = await addRmend(newRmend);
            if(typeof response === 'number'){
                console.log("IT WENNTTTTTTTT");
                clearForms();
                newRmend.rmend_id = response;
            } else if(typeof response === 'string'){
                setMediaResult(response);
            }
        } else {
            setMediaResult('Recommended Media must be valid')
        }
    }

    async function handleResults(e: FormEvent){
        e.preventDefault();
        const title = rmendTitleForm.current!.value
        const type = rmendTypeForm.current!.value
        const result = await searchByTitle(type, title)
        if(typeof result != 'undefined'){
            setMediaResult(result)
        } else {
            setMediaResult(`This ${type} does not exist..`)
        }
    }

    function clearForms(){
        rmendTitleForm.current!.value = ''
        rmendTypeForm.current!.value = ''
        bodyForm.current!.value = ''
        genreForm.current!.value = ''
        setRating(2.5)
        setMediaResult('')
    }

    return (
        <form onSubmit={submitRmend} className='rmend-for-form' >
            <h3>{ user.logged ? `Write an rMEND for ${rmendFor.title}` : 'Must be logged in to write rMEND' }</h3>
            { typeof mediaResult != 'string' ? <p>{ mediaResult.title } ({ mediaResult.year })</p> : mediaResult === '' ? '' : <p>{mediaResult}</p> }
            <div className='rmend-for-data'>
                <div className='rmend-for-data-inputs'>
                    <input type="text" 
                        ref={rmendTitleForm} 
                        placeholder='What would you recommend for this? (by title)' 
                        className='rmend-for-title-form'
                        readOnly={user.logged ? false: true }
                        disabled={user.logged ? false : true }
                    />
                    <fieldset className='rmend-for-fieldset-form' >
                        <select ref={rmendTypeForm} required className='rmend-for-fieldset-select' disabled={user.logged ? false : true} >
                            <option value="movie">Movie</option>
                            <option value="tv">TV</option>
                            <option value="album">Album</option>
                            <option value="podcast">Podcast</option>
                            <option value="game">Video Game</option>
                        </select>
                    </fieldset>
                </div>
                <button onClick={handleResults} >Search For</button>
            </div>
            <textarea ref={bodyForm} 
                className="rmend-body-form" 
                placeholder='Why would you recommend it?'
                disabled={ user.logged ? false : true}
            />
            <div className='rmend-for-reasons'>
                <div>
                    <input type="text" 
                        ref={genreForm} 
                        placeholder='Genre ie. #spooky, #scary' 
                        className='rmend-for-genre-form' 
                        disabled={ user.logged ? false : true}
                    />
                    <Typography component="legend">Rating:</Typography>
                    <StyledRating
                        name="customized-color"
                        defaultValue={2}
                        getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                        precision={0.5}
                        icon={<Favorite fontSize="inherit" htmlColor='palevioletred' />}
                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                        value={rating}
                        disabled={ user.logged ? false : true}
                        onChange={(event, newValue) => {
                            console.log(event);
                            setRating(newValue);
                        }}
                    />
                </div>
                <input type="submit" 
                    value="add rMEND" 
                    className='rmend-for-submit-form' 
                    disabled={ user.logged ? false : true}
                />
            </div>
        </form>
  )
}

export default RmendForm;