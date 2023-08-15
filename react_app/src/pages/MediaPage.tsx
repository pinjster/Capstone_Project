import { useEffect } from "react";
import { useParams } from "react-router-dom"
//import { MediaType } from "../types";
import { useNavigate } from "react-router-dom"

function MediaPage() {

    const { type, id } = useParams()
    //const [ media, setMedia ] = useState<MediaType>()
    const nav = useNavigate()
    

    useEffect(() => {
        if(type && id){

        } else {
            nav('/')
        }
    })

  return (
    <div>MediaPage</div>
  )
}

export default MediaPage