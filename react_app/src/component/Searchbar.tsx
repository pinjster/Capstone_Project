import { FormEvent, useRef, useState } from "react"
import { MovieDb } from "moviedb-promise";
import { MediaType } from "../types";
import { MovieResult } from "moviedb-promise"
import Rmend from "./Rmend";

export default function Searchbar() {
    
    const searchField = useRef<HTMLInputElement>(null);
    const moviedb = new MovieDb(import.meta.env.VITE_APP_MOVIE_KEY)
    const [ results, setResults ] = useState<MediaType[]>([])


    function submitSearch(e: FormEvent){
        e.preventDefault();
        setResults([]);
        const title = searchField.current!.value
        moviedb.searchMulti({ query: `${title}` })
            .then((res) => {
                if(typeof res.results != "undefined"){
                    for(let item of res.results){
                        if(item.media_type == 'movie'){
                            const media = MovieToMediaType(item);
                            setResults((results) => [...results, media])
                        }
                    }
                    console.log(res.results);
                    console.log(results);
                }
            })
            .catch(console.error)        
    }

    function MovieToMediaType(movie: MovieResult): MediaType {
        return {
            title: movie.title!,
            year: movie.release_date!,
            mediaID: movie.id!,
            type: movie.media_type,
            description: movie.overview!,
            img: movie.poster_path!,
            genre: movie.genre_ids!
        };
    }

    return (
        <div>
            <form onSubmit={submitSearch} className="searchbar">
                <input type="text" ref={searchField} placeholder="search movie by title"/>
                <input type="submit" value="Search" />
            </form>
            { results.map((result, i) => <Rmend media={result} key={i} /> )}
        </div>
        
    )

};
