import { Dispatch, SetStateAction, createContext, useState } from "react";
import { MediaType } from "../types";
import { MovieDb, MovieResponse, ShowResponse } from "moviedb-promise";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

interface MediaContextValues {
    medias: MediaType[],
    setMedias: Dispatch<SetStateAction<MediaType[]>>,
    resetMedias: () => void,
    searchByMediaId: (type: string, id: string) => Promise<MediaType | undefined>,
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
    const spotID = import.meta.env.VITE_APP_MUSIC_ID
    const spotSecret = import.meta.env.VITE_APP_MUSIC_SECRET

    const resetMedias = () => {
        setMedias([])
    }

    async function searchMediasByTitle(title: string){
        setMedias([]);
        await searchMoviesTvTitle(title);
        await searchGamesTitle(title);
        await searchAlbumsTitle(title);
        await searchPodcastsTitle(title);
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
            const album = await getAlbumByTitle(title);
            if(album){
                return album
            }
        }else if(type === 'podcast'){
            const podcast = await getPodcastByTitle(title);
            if(podcast){
                return podcast;
            }
        }else if(type === 'game'){
            const game = await getGameByTitle(title);
            if(game){
                return game
            }
        }
        return undefined
    }

    const searchByMediaId = async (type: string, id: string): Promise<MediaType | undefined> => {
        if(type === 'movie'){
            const movie = await getMovieInfo(parseInt(id));
            if(movie){
                return movie;
            }
        } else if(type === 'tv'){
            const tv = await getTvInfo(parseInt(id));
            if(tv){
                return tv;
            }
        } else if(type === 'album'){
            const album = await getAlbumInfo(id)
            if(album){
                return album;
            }
        } else if(type === 'podcast'){
            const podcast = await getPodcastInfo(id);
            if(podcast){
                return podcast;
            }
        } else if(type === 'game'){
            const game = await getGameInfo(parseInt(id));
            if(game){
                return game;
            }
        } else {
            return undefined
        }
    }

    async function searchPodcastsTitle(title: string){
        const spotify = SpotifyApi.withClientCredentials(spotID, spotSecret);
        const items = await spotify.search(title, ['show'], 'ES', 10);
        for(let show of items.shows.items){
            const formatPodcast = await getPodcastInfo(show.id);
            setMedias((medias) => [...medias, formatPodcast]);
        }
    }

    async function searchAlbumsTitle(title: string){
        const spotify = SpotifyApi.withClientCredentials(spotID, spotSecret);
        const items = await spotify.search(title, ['album'], undefined, 10);
        for(let album of items.albums.items){
            const formatAlbum = await getAlbumInfo(album.id);
            setMedias((medias) => [...medias, formatAlbum])
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

    async function searchGamesTitle(title: string){
        const res = await fetch(`https://api.rawg.io/api/games?key=${rawgKey}&search=${title}&exclude_additions=trur&search_precise=true&page_size=5`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(res.ok){
            const data = await res.json();
            for(let game of data.results){
                const newGame = await getGameInfo(game.id);
                setMedias((medias) => [...medias, newGame!]);
            }
        }
        return undefined;
    }

    async function getPodcastByTitle(title: string){
        const spotify = SpotifyApi.withClientCredentials(spotID, spotSecret);
        const items = await spotify.search(title, ['show'], 'ES', 1);
        for(let show of items.shows.items){
            const formatPodcast = await getPodcastInfo(show.id);
            return formatPodcast
        }
    }

    async function getAlbumByTitle(title: string){
        const spotify = SpotifyApi.withClientCredentials(spotID, spotSecret);
        const items = await spotify.search(title, ['album'], undefined, 1);
        for(let album of items.albums.items){
            const formatAlbum = await getAlbumInfo(album.id);
            return formatAlbum
        }
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
        const res = await fetch(`https://api.rawg.io/api/games?key=${rawgKey}&search=${title}&search_precise=true&search_exact=true&page_size=1`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(res.ok){
            const data = await res.json();
            for(let game of data.results){
                const newGame = await getGameInfo(game.id);
                return newGame;
            }
        }
        return undefined;
    }

    async function getPodcastInfo(id: string){
        const spotify = SpotifyApi.withClientCredentials(spotID, spotSecret);
        const podcast = await spotify.shows.get(id, 'ES');
        const formatPodcast = PodcastToMediaType(podcast);
        return formatPodcast;
    }

    async function getAlbumInfo(id: string){
        const spotify = SpotifyApi.withClientCredentials(spotID, spotSecret);
        const album = await spotify.albums.get(id);
        const formatAlbum = AlbumToMediaType(album);
        return formatAlbum
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
            const data = await res.json();
            const formatGame = GameToMediaType(data);
            return formatGame;
        } 
        return
    }

    function MovieToMediaType(movie: MovieResponse): MediaType {
        const genre: string[] = [];
        for(let gen of movie.genres!){
            genre.push(gen.name!);
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
    
    function PodcastToMediaType(podcast: any): MediaType {
        const genres: string[] = [];
        return {
            title: podcast.name,
            year: podcast.episodes.items[0].release_date.slice(0,4),
            mediaID: podcast.id,
            type: 'podcast',
            description: podcast.description,
            author: podcast.publisher,
            img: podcast.images[0].url,
            genre: genres
        }
    }

    function GameToMediaType(game: any): MediaType {
        const genres = game.genres.map((genre: any) => { return genre.name })
        return {
            title: game.name,
            year: game.released?.slice(0,4) || '????',
            mediaID: game.id,
            type: "game",
            description: game.description_raw,
            author: 'some folks',
            img: game.background_image,
            genre: genres 
        }
    }

    function AlbumToMediaType(album: any): MediaType {
        const genres: string[] = [];
        if(album.genres.length > 0){
            for(let genre of album.genres){
                genres.push(genre.name)
            }
        }
        let description: string = `Artist: ${album.artists[0].name}\n`;
        for(let track of album.tracks.items){
            description += `${track.track_number}: ${track.name}\n`
        }
        return {
            title: album.name,
            year: album.release_date.slice(0,4) || '????',
            mediaID: album.id,
            type: 'album',
            description: description,
            author: album.artists[0].name,
            img: album.images[0].url,
            genre: genres,
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


