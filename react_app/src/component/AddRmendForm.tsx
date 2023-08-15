import { Typography } from '@mui/material';
import StyledRating from '@mui/material/Rating';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';
import { useRef } from "react";

function AddRmendForm() {
    const bodyForm = useRef<HTMLInputElement>(null);
    const rmendForTitleForm = useRef<HTMLInputElement>(null);
    const rmendForTypeForm = useRef<HTMLSelectElement>(null);

    const [rating, setRating ] = useState<number | null>(0)

    return (
        <form action="">
            <input type="text" ref={rmendForTitleForm} placeholder='What would you recommend this for?' />
            <fieldset>
                <select ref={rmendForTypeForm} required>
                    <option value="movie">Movie</option>
                    <option value="tv">TV</option>
                    <option value="album">Album</option>
                    <option value="podcast">Podcast</option>
                    <option value="game">Video Game</option>
                </select>
            </fieldset>
            <input type="text" ref={bodyForm} className="rmend-body-form" placeholder='Why would you recommend it?' />
            <div>
                <Typography component="legend">Rating:</Typography>
                <StyledRating
                    name="customized-color"
                    defaultValue={2}
                    getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                    precision={0.5}
                    icon={<Favorite fontSize="inherit" htmlColor='palevioletred' />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    value={rating}
                    onChange={(event, newValue) => {
                        console.log(event);
                        setRating(newValue);
                  }}
                />
            </div>
            <input type="submit" value="add rMEND" />
        </form>
  )
}

export default AddRmendForm;