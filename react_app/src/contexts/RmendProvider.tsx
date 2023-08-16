import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { RmendType } from "../types";
import { UserContext } from "./UserProvider";

interface RmendContextValues {
    rmends: RmendType[] | RmendType,
    setRmends: Dispatch<SetStateAction<RmendType[]>>,
    addRmend: (rmend: RmendType) => {},
    editRmend: (rmend: RmendType) => {},
    deleteRmend: (rmend: RmendType) => {},
    likeRmend: (rmend: RmendType) => {},
    unlikeRmend: (rmend: RmendType) => {}
}

export const RmendContext = createContext({} as RmendContextValues);
export default function RmendProvider({ children }: { children: JSX.Element | JSX.Element[] }){
    
    const [rmends, setRmends] = useState<RmendType[]>([]);
    const { user } = useContext(UserContext)
    const baseAPI = import.meta.env.VITE_APP_BASE_API

    const addRmend = async (rmend: RmendType) => {
        if(user.logged){
            const res = await fetch(`${baseAPI}/rmnd/add-rmend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Bearer': user.accessToken,
                },
                body: JSON.stringify({
                    'user_rating': rmend.userRating,
                    'title': rmend.media.title,
                    'body': rmend.body,
                    'media_id': rmend.rmend_id,
                    'year': rmend.media.mediaID,
                    'type': rmend.media.type,
                    'description': rmend.media.description,
                    'author': rmend.media.author,
                    'img': rmend.media.img,
                    'rmend_for_title': rmend.rmendForTitle,
                    'rmend_for_type': rmend.rmendForType,
                    'genres': rmend.media.genre
                })
            });
            if(res.ok){

                return 'ok'
            } else if(res.status === 409){
                return res.statusText;
            } else {
                return 'bad'
            }
        }
        return 'not logged in'
    };

    const editRmend = async (rmend: RmendType) => {
        if(user.logged){
            const res = await fetch(`${baseAPI}/rmnd/edit-rmend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Bearer': user.accessToken,
                },
                body: JSON.stringify({
                    rmend_id: rmend.rmend_id,
                    body: rmend.body,
                    user_rating: rmend.userRating
                })
            })
            if(res.ok){
                return 'ok'
            } else if(res.status === 409){
                return res.statusText
            } else {
                return 'bad'
            }
        }
    };

    const deleteRmend = async (rmend: RmendType) => {
        const res = await fetch(`${baseAPI}/rmnd/delete-recommend/${rmend.rmend_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Bearer': user.accessToken,
            }
        })
        if(res.ok){
            return 'ok'
        } else if(res.status === 409){
            return res.statusText
        } else {
            return 'bad'
        }
    };

    const likeRmend = async (rmend: RmendType) => {
        const res = await fetch(`${baseAPI}/rmnd/like/${rmend.rmend_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Bearer': user.accessToken
            }
        })
        if(res.ok){
            return 'ok'
        } else if(res.status === 409){
            return res.statusText
        } else {
            return 'bad'
        }
    };

    const unlikeRmend = async (rmend: RmendType) => {
        const res = await fetch(`${baseAPI}/rmnd/delete-recommend/${rmend.rmend_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Bearer': user.accessToken
            }
        });
        if(res.ok){
            return 'ok';
        } else if (res.status === 409){
            return res.statusText;
        } else {
            return 'bad';
        }
    };

    const value = {
        rmends,
        setRmends,
        addRmend,
        editRmend,
        deleteRmend,
        likeRmend,
        unlikeRmend
    }

    return (
        <RmendContext.Provider value={value}>
            { children }
        </RmendContext.Provider>
    )
}

