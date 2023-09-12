import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MediaContext } from "../contexts/MediaProvider";
import { MediaType, RmendType } from "../types";
import Media from "../component/Media";
import Body from "../component/Body";
import { RmendContext } from "../contexts/RmendProvider";
import Rmend from "../component/Rmend";
import RmendForm from "../component/RmendForm";

function MediaPage() {

  const { type, id, index } = useParams();
  const { medias } = useContext(MediaContext);
  const { getRmends } = useContext(RmendContext);
  const { searchByMediaId } = useContext(MediaContext);
  
  const nav = useNavigate();

  const [ error, setError ] = useState('');
  const [ rmends, setRmends ] = useState<RmendType[]>([]);
  const [ thisMedia, setThisMedia] = useState<MediaType>();
    
  useEffect(() => {
    if(type && id && typeof index != 'undefined' && parseInt(index) >= 0){
      searchByIndex();
    } else if(typeof type != 'undefined' && typeof id != 'undefined'){
      searchByTypeId();
    } else {
      nav('/')
    }
  },[type, id, index]);
    
  function searchByIndex(){
    setThisMedia(medias[parseInt(index!)]);
    getRmendsForMedia();
  }

  async function searchByTypeId(){
    if(typeof type != 'undefined' && typeof id != 'undefined'){
      const media = await searchByMediaId(type, id)
      if(typeof media != 'undefined'){
        setThisMedia(media);
        getRmendsForMedia();
      } else {
        setError('We cannot find that which does not exist... ')
      }
    }
  }

  async function getRmendsForMedia(){
    if(typeof type != 'undefined' && typeof id != 'undefined'){
      const rmends = await getRmends(type, parseInt(id))
      if(typeof rmends != 'undefined'){
        setRmends(rmends);
      }
    }
  }

  function addRmendToPage(rmend: RmendType){
    setRmends([rmend, ...rmends])
  }

  function removeRmendFromPage(rmend: RmendType){
    console.log(rmend.rmend_id);
    setRmends((rmends) => { return rmends.filter((eachRmend) => { eachRmend.rmend_id != rmend.rmend_id }) })
  }

  return (
    <Body navbar footer>
        <h3>{ error }</h3>
        { thisMedia ? 
        <div>
          <Media media={thisMedia}></Media> 
          <RmendForm rmendFor={thisMedia} addRmendToPage={addRmendToPage} />
          { rmends.length > 0 ? rmends.map((rmend, i) => <Rmend key={i} rmend={rmend} removeRmendFromPage={removeRmendFromPage} /> ) 
          : <p>There are no Rmends for this yet.. </p> }
        </div>
          : <span /> }
    </Body>      
  )
}

export default MediaPage