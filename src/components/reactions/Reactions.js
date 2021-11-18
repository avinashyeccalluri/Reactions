import React, { useEffect, useState } from "react";
import EmojiList from "../emojiList/EmojiList";
import SummaryModal from "../summaryModal/SummaryModal";
import "./reaction.css";

function getResult(data) {

  const initialObject = data.reduce((arr, input, {index})=>{
      const key = input.content_id;
      const reactionID = input.reaction_id;
    arr[key] = {...(arr[key] ?? {}), [reactionID ] : []}
    return arr;

  }, {})

  return data.reduce((arr, input)=>{
      arr[input.content_id][input.reaction_id].push(input.user_id)
      return arr;
  },initialObject)
}

export const UserDataContext = React.createContext();

const Reactions = ({ contentID }) => {
  const [reactionDetails, setReactionDetails] = useState([]);

  const [alteredFlag, setAlteredFlag] = useState(false);

  const [emojiReacted, setEmojiReacted] = useState([]);

  const [isCallQueued, setIsCallQueued] = useState(false)

  const user_id = 2;

  const getLikedPostDetails = (data, userID) => {

    var output = data.reduce((acc, reactionData) => {
      if (reactionData.user_id == userID) {
        acc.push({
          content_id: reactionData.content_id,
          reaction_id: reactionData.reaction_id,
          user_content_reactions_id : reactionData.id
        });
      }
      return acc;
    }, []);

    setEmojiReacted(output);
  };

  
  const summaryModalHighlighter = (reaction_id)=>{
    var a = Array.from(document.getElementsByClassName("reaction-details-outer"));
    var b = Array.from(document.getElementsByClassName("each-added-reactions"));
    console.log("main here");
    console.log(reaction_id);
    if(reaction_id === 0){
      a.map(element=>{
         element.style.display = "block";
      })
      b.map((element, index)=>{
        (index === 0) ? element.classList.add('active') : element.classList.remove('active');
      }) 

    }
    else{
      a.map(element=>{
        (element.getAttribute('reaction_id') == reaction_id) ? element.style.display = "block" : element.style.display = "none";
      })
  
      b.map(element=>{
        (element.getAttribute('reaction_id') == reaction_id) ? element.classList.add('active') : element.classList.remove('active');
  
      })

    }


  }

  const summaryTrigger = (e, reaction_id) => {
    let timeOut;
    e.addEventListener("mouseover", (e) => {
      timeOut = setTimeout(() => {
        document.querySelector("#summary-component").click();
        summaryModalHighlighter(reaction_id)
        clearTimeout(timeOut)
      }, 1500);

    });

    e.addEventListener("mouseout", (e) => {
      clearTimeout(timeOut);
    });
  };

  let icon_mapping = {
    1: "👍",
    2: "❤️",
    3: "😂",
    4: "😮",
    5: "😥",
    6: "😡",
  };

  const getStuff = async () => {
    var promise = await fetch(
      "https://artful-iudex.herokuapp.com/user_content_reactions"
    );
    var response = await promise.json();
    let initialObject = getResult(response);
    getLikedPostDetails(response, user_id);
    let finalObject = [];
    Object.entries(initialObject).map((eachContentData, index) => {
      let tempObj = {};
      tempObj["contentID"] = eachContentData[0];
      tempObj["userID"] = user_id;
      let reactionDataFromApiObj = eachContentData[1];
      let tempReactionData = [];

      Object.entries(reactionDataFromApiObj).map((eachEntry, index) => {
        let individualReactionData = {};
        individualReactionData["reaction_id"] = eachEntry[0];
        individualReactionData["users"] = eachEntry[1];
        tempReactionData.push(individualReactionData);
      });

      tempObj["reactionData"] = tempReactionData;
      finalObject.push(tempObj);
    });

    setReactionDetails(finalObject);
  };

  
  const addReaction = async (userData, reaction_id)=>{

    if(!isCallQueued){
      setIsCallQueued(true);
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
        
        setAlteredFlag((prev)=> {return !prev})
        setIsCallQueued(false);
    
    }

    }

  useEffect(() => {
    getStuff();

  }, [alteredFlag]);
  return (
    <div className="d-flex">
      {reactionDetails.map((eachContent, index) => {
        if (contentID == eachContent.contentID) {
          return (
            <UserDataContext.Provider value={eachContent} key={index}>
              <div className="reaction">
                {eachContent["reactionData"].map((eachReaction, index1) => {
                  return (
                    <React.Fragment key={index1}>
                      <span
                        onMouseEnter={(e) =>{
                          summaryTrigger(e.target, eachReaction.reaction_id)
                        }}
                        
                        onClick={() =>
                          addReaction(eachContent, eachReaction.reaction_id)
                        }
                        className={`selected-emoji ${
                          eachReaction["users"].includes(user_id)
                            ? "selected"
                            : ""
                        } `}
                      >
                        {icon_mapping[eachReaction["reaction_id"]]} ∙ {eachReaction["users"].length}
                      </span>
                    </React.Fragment>
                  );
                })}
                <span></span>

                <button
                  type="button"
                  id="summary-component"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#exampleModal"
                  hidden
                ></button>
              </div>
              <div className="reaction-types d-flex align-items-center">
                <div className="reaction-trigger-outer">
                  <button className="reaction-trigger"></button>
                  <div className="emoji-buttons-container">
                    <EmojiList emojiReacted={emojiReacted} setAlteredFlag={setAlteredFlag} addReaction={addReaction}/>
                  </div>
                </div>
              </div>
              <SummaryModal summaryModalHighlighter={summaryModalHighlighter} />
            </UserDataContext.Provider>
          );
        }
      })}
    </div>
  );
};

export default Reactions;
