import React, {useEffect, useState, useContext} from 'react'
import {UserDataContext} from '../reactions/Reactions'
import './emojiList.css'

const EmojiList = ({setDeleteFlag, emojiReacted}) => {
  
    const addReaction = async (userData, reaction_id)=>{
      var deleteExistingReaction = false;
      var deletingReactionID = '';
      emojiReacted.map((data)=>{
        if(data.content_id == userData.contentID){
          deleteExistingReaction =  true;
          deletingReactionID = data.user_content_reactions_id;
        }
      })
      if(deleteExistingReaction){
        await fetch(`https://artful-iudex.herokuapp.com/user_content_reactions/${deletingReactionID}`, {
            method: "DELETE",
        })
        

      }
        await fetch(`https://artful-iudex.herokuapp.com/user_content_reactions/`, {
            method: "POST",
            body: JSON.stringify({
                user_id:parseInt(userData.userID),
                reaction_id: parseInt(reaction_id),
                content_id: parseInt(userData.contentID)
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
        })
        
        setDeleteFlag((prev)=> {return !prev})
    
    }

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
