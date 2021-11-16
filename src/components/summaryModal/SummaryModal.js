import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../reactions/Reactions";
import './summaryModal.css'

const showSelectedData = (reaction_id) => {
  var a = document.getElementsByClassName("reaction-details-outer");
  var b = document.getElementsByClassName("each-added-reactions");
  
  for (var index = 0; index < b.length; index++) {
    b[index].getAttribute("reaction_id") === reaction_id
      ? b[index].classList.add("active")
      : b[index].classList.remove("active");
  }
  if (reaction_id === "") {
    for (var index = 0; index < a.length; index++) {
      a[index].style.display = "block";
    }
  } else {
    for (var index = 0; index < a.length; index++) {
      a[index].style.display = "block";
    }
    for (var index = 0; index < a.length; index++) {
      if (a[index].getAttribute("reaction_id") !== reaction_id) {
        a[index].style.display = "none";
      }
    }
  }
};

const SummaryModal = () => {
  const userData = useContext(UserDataContext);

  const [summaryDetails, setSummaryDetails] = useState([]);

  const summaryTrigger = async (data, reaction_id = null) => {
    document.querySelector("#summary-component").click();
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
    summaryTrigger(userData);
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
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Reactions
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="">
              <div className="d-flex"></div>
              <div className="d-flex added-reactions">
                <span
                  className="each-added-reactions active"
                  onClick={() => showSelectedData("")}
                >
                  All{" "}
                </span>
                {userData["reactionData"].map((eachReaction, index1) => {
                  return (
                    <span
                      className="each-added-reactions"
                      reaction_id={eachReaction["reaction_id"]}
                      key={eachReaction["reaction_id"]}
                      onClick={() =>
                        showSelectedData(eachReaction["reaction_id"])
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
    </div>
  );
};

export default SummaryModal;
