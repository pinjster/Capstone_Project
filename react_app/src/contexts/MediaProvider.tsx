import { Dispatch, SetStateAction, createContext, useState } from "react";
import { MediaType } from "../types";
import { MovieDb, MovieResponse, ShowResponse } from "moviedb-promise";

interface MediaContextValues {
    medias: MediaType[],
    setMedias: Dispatch<SetStateAction<MediaType[]>>,
    resetMedias: () => void,
    searchByMediaId: (type: string, id: number) => Promise<MediaType | undefined>,
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
        //NEEDS FIXED I GUESS
    const searchByMediaId = async (type: string, id: number): Promise<MediaType | undefined> => {
        if(type === 'movie'){
            const movie = await getMovieInfo(id);
            if(movie){
                return movie;
            }
        } else if(type === 'tv'){
            const tv = await getTvInfo(id);
            if(tv){
                return tv;
            }
        } else if(type === 'album'){
            return undefined
        } else if(type === 'podcast'){
            return undefined
        } else if(type === 'game'){
            return undefined
        } else {
            return undefined
        }
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
                                setMedias((medias) => [...medias, tv!]),[]
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
            const formatTv = TvToMediaType(res)
            return formatTv;
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
            year: movie.release_date?.slice(0,4) || 'unknown',
            mediaID: movie.id!,
            type: "movie",
            description: movie.overview || 'unknown',
            author: 'just some guy',
            //author: movie.production_companies![0].name! || 'unknown', 
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
            year: tv.first_air_date?.slice(0,4) + ' - ' + (tv.last_air_date?.slice(0,4) || '????') || 'unknown',
            mediaID: tv.id!,
            type: 'tv',
            description: tv.overview || 'unknown',
            author: 'just some guy',
            //author: tv.created_by![0].name! || 'unknown',
            img: "https://image.tmdb.org/t/p/w500/" + tv.poster_path || '',
            genre: genre,
        }
    }

    const value = {
        medias,
        setMedias,
        resetMedias,
        searchByMediaId,
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


