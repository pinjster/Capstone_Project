import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MediaContext } from "../contexts/MediaProvider";
import { MediaType } from "../types";
import Media from "../component/Media";

function MediaPage() {

    const { type, id, index } = useParams();
    const { medias } = useContext(MediaContext);
    const [ thisMedia, setThisMedia] = useState<MediaType>();
    const nav = useNavigate();
    
    useEffect(() => {
      console.log(type, id, index);
      if(type && id && typeof index != 'undefined' && parseInt(index) >= 0){
        setThisMedia(medias[parseInt(index)]);
      } else if(typeof type != 'undefined' && typeof id != 'undefined'){
        console.log('NEEDDS PATCHED');
      } else {
          nav('/')
      }
    });

    return (
      <div>
        <h1>Media</h1>
        { thisMedia ? <Media media={thisMedia}></Media> : 'We cannot find that which does not exist...' }
        { !thisMedia ? '' : '' }
      </div>
    )
}

export default MediaPage