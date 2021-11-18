import React, {useEffect, useState, useContext} from 'react'
import {UserDataContext} from '../reactions/Reactions'
import './emojiList.css'

const EmojiList = ({setAlteredFlag, emojiReacted, addReaction}) => {
  

    const userData = useContext(UserDataContext);


    const [emojiList, setEmojiList] = useState([])


    useEffect(()=>{

        fetch("https://artful-iudex.herokuapp.com/reactions").then(res => res.json()).then(response=> setEmojiList(response));

    }, [])
    return (
        <div className="reaction-buttons d-flex align-items-center">
        
          {emojiList.map((emoji)=>{
            return(
              <button onClick={()=>addReaction(userData, emoji.id)} key={emoji.id} className="emoji" data-tooltip={emoji.name}>{emoji.emoji}</button>
            )
          })}
        </div>
    )
}

export default EmojiList
