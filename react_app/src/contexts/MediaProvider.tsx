import { Dispatch, SetStateAction, createContext, useState } from "react";
import { MediaType } from "../types";
import { MovieDb, MovieResponse, ShowResponse } from "moviedb-promise";

interface MediaContextValues {
    medias: MediaType[],
    setMedias: Dispatch<SetStateAction<MediaType[]>>,
    resetMedias: () => void,
    searchByMediaId: (type: string, id: number) => Promise<MediaType | undefined>,
    searchMoviesTvTitle: (title :string) => {},
    getTvInfo: (id: number) => Promise<void | MediaType>,
    getMovieInfo: (id: number) => Promise<void | MediaType>,
    searchByTypeTitle: (type: string, title: string) => Promise<MediaType | undefined>,
    searchMediasByTitle: (title: string) => Promise<void>
}

export const MediaContext = createContext({} as MediaContextValues);
export default function MediaProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
    
    const [medias, setMedias] = useState<MediaType[]>([]);
    const moviedb = new MovieDb(import.meta.env.VITE_APP_MOVIE_KEY)
    const rawgKey = import.meta.env.VITE_APP_GAME_API

    const resetMedias = () => {
        setMedias([])
    }

    async function searchMediasByTitle(title: string){
        setMedias([]);
        searchMoviesTvTitle(title)
        getGameByTitle(title)
    }

    async function searchByTypeTitle(type: string, title: string) {
        if(type === 'movie'){
            const movie = await getMovieByTitle(title);
            if(movie){
                return movie
            }
        }else if(type === 'tv'){
            const tv = await getTvByTitle(title);
            if(tv){
                return tv
            }
        }else if(type === 'album'){
            return undefined
        }else if(type === 'podcast'){
            return undefined
        }else if(type === 'game'){
            const game = getGameByTitle(title);
            return game
        }
        return undefined
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

    async function getMovieByTitle(title: string){
        const result = await moviedb.searchMovie({ query: title });
        if(typeof result.results != 'undefined' && result.results?.length > 0){
            return await getMovieInfo(result.results[0]?.id!);
        } else {
            return undefined;
        }
    }

    async function getTvByTitle(title: string){
        const result = await moviedb.searchTv({ query: title });
        if(typeof result.results != 'undefined'){
            return await getTvInfo(result.results[0]?.id!);
        } else {
            return undefined;
        }
    }

    async function getGameByTitle(title: string){
        const res = await fetch(`https://api.rawg.io/api/games?key=${rawgKey}&search=${title}&search_precise=true&page_size=10`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(res.ok){
            const data = await res.json()
            console.log(data);
            for(let game of data.results){

            }
        }
        return undefined;
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

    async function getGameInfo(id: number) {
        const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${rawgKey}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(res.ok){
            const formatGame = GameToMediaType(res);
            return formatGame;
        } 
        return
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
    
    function GameToMediaType(game: any): MediaType {
        const genres = game.genres.map((genre: any) => { genre.name.toLowerCase() })
        return {
            title: game.name,
            year: game.released,
            mediaID: game.id,
            type: "game",
            description: game.description,
            author: 'some folks',
            img: game.background_image,
            genre: genres 
        }
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
        searchByTypeTitle,
        searchMediasByTitle
    };

    return (
        <MediaContext.Provider value={value}>
            { children }
        </MediaContext.Provider>
    )
};


