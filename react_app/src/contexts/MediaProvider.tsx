import { Dispatch, SetStateAction, createContext, useState } from "react";
import { MediaType } from "../types";
import { MovieDb, MovieResponse, ShowResponse } from "moviedb-promise";

interface MediaContextValues {
    medias: MediaType[],
    setMedias: Dispatch<SetStateAction<MediaType[]>>,
    resetMedias: () => void,
    searchMoviesTvTitle: (title :string) => {},
    getTvInfo: (id: number) => {},
    getMovieInfo: (id: number) => {},
}

export const MediaContext = createContext({} as MediaContextValues);
export default function MediaProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
    
    const [medias, setMedias] = useState<MediaType[]>([]);
    const moviedb = new MovieDb(import.meta.env.VITE_APP_MOVIE_KEY)

    const resetMedias = () => {
        setMedias([])
    }

    const searchMoviesTvTitle = async (title: string) => {
        await moviedb.searchMulti({ query: `${title}` })
            .then(async (res) => {
                if(typeof res.results != "undefined"){
                    for(let item of res.results){
                        if(typeof item.id != "undefined"){
                            if(item.media_type == 'movie'){
                                const movie = await getMovieInfo(item.id)
                                setMedias((medias) => [...medias, movie!])
                            } else if(item.media_type == 'tv'){
                                const tv = await getTvInfo(item.id)
                                setMedias((medias) => [...medias, TvToMediaType(tv!)]),[]
                            }
                        }
                    }
                }
            })
            .catch(console.error),[]
    }

    const getTvInfo = (id: number) => {
        const tv = moviedb.tvInfo({ id: id })
        .then((res) => {
            return res;
        })
        .catch(console.error)
        return tv
    }
    
    const getMovieInfo = (id: number) => {
        const movie = moviedb.movieInfo({ id: id })
        .then((res) => {
            const formatMovie = MovieToMediaType(res)
            return formatMovie;
        })
        .catch(console.error)
        return movie
    }

    function MovieToMediaType(movie: MovieResponse): MediaType {
        const genre: string[] = [];
        for(let gen of movie.genres!){
            genre.push(gen.name!)
        }
        return {
            title: movie.title || 'unknown',
            year: movie.release_date || 'unknown',
            mediaID: movie.id!,
            type: "movie",
            description: movie.overview || 'unknown',
            img: "https://image.tmdb.org/t/p/w500/" + movie.poster_path || '',
            genre: genre
        };
    }
    
    function TvToMediaType(tv: ShowResponse): MediaType {
        const genre: string[] = [];
        for(let gen of tv.genres!){
            genre.push(gen.name!)
        }
        return {
            title: tv.original_name || 'unknown',
            year: tv.first_air_date || 'unknown',
            mediaID: tv.id!,
            type: 'tv',
            description: tv.overview || 'unknown',
            img: "https://image.tmdb.org/t/p/w500/" + tv.poster_path || '',
            genre: genre,
        }
    }

    const value = {
        medias,
        setMedias,
        resetMedias,
        searchMoviesTvTitle,
        getMovieInfo,
        getTvInfo,
    };

    return (
        <MediaContext.Provider value={value}>
            { children }
        </MediaContext.Provider>
    )
};


