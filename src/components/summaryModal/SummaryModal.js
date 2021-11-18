import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../reactions/Reactions";
import './summaryModal.css'

const SummaryModal = ({summaryModalHighlighter}) => {
  const userData = useContext(UserDataContext);

  const [summaryDetails, setSummaryDetails] = useState([]);

  const summaryTriggerer = async (data, reaction_id = null) => {
    let reactionsPromise = "";
    if (reaction_id == null) {
      reactionsPromise = await fetch(
        `https://artful-iudex.herokuapp.com/user_content_reactions?content_id=${data.contentID}`
      );
    } else {
      reactionsPromise = await fetch(
        `https://artful-iudex.herokuapp.com/user_content_reactions?content_id=${data.contentID}?reaction_id${reaction_id}`
      );
    }
    const reactionsData = await reactionsPromise.json();
    const userPromise = await fetch(`https://artful-iudex.herokuapp.com/users`);
    const userList = await userPromise.json();

    var output = reactionsData.reduce((acc, data) => {
      var key = data.reaction_id;
      acc[key] = [...(acc[key] ?? []), data.user_id];
      return acc;
    }, {});

    const main = Object.entries(output).reduce((arr, pair) => {
      const [key, value] = pair;
      var reactedUsersCred = [];
      var flag = false;
      userList.map((data, index, { length }) => {
        if (value.includes(data.id)) {
          reactedUsersCred = [...reactedUsersCred, data];
          flag = true;
        }
        if (flag && length - 1 === index)
          arr.push({ reaction_id: key, users: reactedUsersCred });
      });
      return arr;
    }, []);
    setSummaryDetails(main);
  };

  useEffect(() => {
    summaryTriggerer(userData);
  }, []);

  let icon_mapping = {
    1: "👍",
    2: "❤️",
    3: "😂",
    4: "😮",
    5: "😥",
    6: "😡",
  };

  return (
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Reactions</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">
              <div className="d-flex added-reactions">
                <span
                  className="each-added-reactions d-flex justify-content-center" reaction_id="0"
                  onClick={() => summaryModalHighlighter(0)}
                >
                  All{" "}
                </span>
                {userData["reactionData"].map((eachReaction, index1) => {
                  return (
                    <span
                      className="each-added-reactions d-flex justify-content-center"
                      reaction_id={eachReaction["reaction_id"]}
                      key={eachReaction["reaction_id"]}
                      onClick={() =>
                        summaryModalHighlighter(eachReaction["reaction_id"])
                      }
                    >
                      {icon_mapping[eachReaction["reaction_id"]]}.
                      {eachReaction["users"].length}
                    </span>
                  );
                })}
              </div>
              <div className="reacted-users-container">
                {summaryDetails.map((data, index) => {
                  return data["users"].map((innerData, index) => {
                    return (
                      <div key={data.reaction_id}
                        className="reaction-details-outer "
                        reaction_id={parseInt(data.reaction_id)}
                      >
                        <span className="reacted-users-avatar">
                          <img srcSet={innerData.avatar} alt=""/>
                        </span>
                        <span className="reaction-details">
                          {icon_mapping[parseInt(data.reaction_id)]}{" "}
                          {innerData.first_name + " " + innerData.last_name}
                        </span>
                      </div>
                    );
                  });
                })}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
