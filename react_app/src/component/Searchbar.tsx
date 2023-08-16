import { FormEvent, useContext, useRef } from "react"
import { MediaContext } from "../contexts/MediaProvider";
import Media from "./Media";


export default function Searchbar() {

    const searchField = useRef<HTMLInputElement>(null);
    const { medias, searchMoviesTvTitle, resetMedias } = useContext(MediaContext)

    async function submitSearch(e: FormEvent){
        e.preventDefault();
        resetMedias();
        const title = searchField.current!.value;
        searchMoviesTvTitle(title);
    }

    return (
        <div>
            <form onSubmit={submitSearch} className="searchbar">
                <input type="text" ref={searchField} placeholder="search movie by title"/>
                <input type="submit" value="Search" />
                { medias.map((media, i) => <Media media={media} key={i} /> )}
            </form>
        </div>
        
    )

};
