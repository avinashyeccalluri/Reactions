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

  const [deleteFlag, setDeleteFlag] = useState({});

  const [emojiList, setEmojiList] = useState([]);

  const [showSummary, setShowSummary] = useState(false);

  const [emojiReacted, setEmojiReacted] = useState([]);

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

  const summaryTrigger = (e) => {
    let timeOut;
    e.addEventListener("mouseover", (e) => {
      timeOut = setTimeout(() => {
        showSummary && document.querySelector("#summary-component").click();
        setShowSummary(true);
      }, 1500);

      var a = document.getElementsByClassName("reaction-details-outer");

      for (var index = 0; index < a.length; index++) {
        a[index].style.display = "block";
      }
    });

    e.addEventListener("mouseout", (e) => {
      clearTimeout(timeOut);
    });
  };

  const deleteReaction = async (params) => {
    if (params === null) return;
    const specificReactionData = await fetch(
      `https://artful-iudex.herokuapp.com/user_content_reactions?content_id=${params.content_id}&user_id=${params.current_user_id}&reaction_id=${params.reaction_id}`
    );

    const jsonSpecificReactionData = await specificReactionData.json();

    const deleteRequest = await fetch(
      `https://artful-iudex.herokuapp.com/user_content_reactions/${jsonSpecificReactionData[0]["id"]}`,
      {
        method: "DELETE",
      }
    );

    setDeleteFlag(await deleteRequest.json());
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

  useEffect(() => {
    getStuff();

    fetch("https://artful-iudex.herokuapp.com/reactions")
      .then((res) => res.json())
      .then((response) => setEmojiList(response));
  }, [deleteFlag, showSummary]);
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
                        onMouseEnter={(e) => summaryTrigger(e.target)}
                        
                        onClick={() =>
                          deleteReaction(
                            eachReaction["users"].includes(user_id)
                              ? {
                                  content_id: eachContent.contentID,
                                  reaction_id: eachReaction.reaction_id,
                                  current_user_id: user_id,
                                }
                              : null
                          )
                        }
                        className={`selected-emoji ${
                          eachReaction["users"].includes(user_id)
                            ? "selected"
                            : ""
                        } `}
                      >
                        {icon_mapping[eachReaction["reaction_id"]]}.
                        {eachReaction["users"].length}
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
                    <EmojiList emojiReacted={emojiReacted} setDeleteFlag={setDeleteFlag} />
                  </div>
                </div>
              </div>
              {showSummary && <SummaryModal />}
            </UserDataContext.Provider>
          );
        }
      })}
    </div>
  );
};

export default Reactions;
