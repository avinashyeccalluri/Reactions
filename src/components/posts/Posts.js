import React from 'react'
import image from '../../images/images1.avif'
import Reactions from '../reactions/Reactions'
import './posts.css'
var posts = [
    {
      content_id: 1,
      first_name: "Lizette",
      last_name: "Phippen",
      email: "lphippen0@berkeley.edu",
      avatar: "http://dummyimage.com/128x134.png/dddddd/000000",
    },
    {
      content_id: 2,
      first_name: "Garreth",
      last_name: "Heikkinen",
      email: "gheikkinen1@naver.com",
      avatar: "http://dummyimage.com/147x121.png/ff4444/ffffff",
    },
  ];
const Posts = () => {
    return (
      <div id="posts" className="posts-container">
        {posts.map((post) => {
          return (
            <>
              <div className="post-outer">
                <div className="avatar">
                  <img src={post.avatar} alt="" srcset="" />
                </div>
                <div className="user-name">{post.first_name}</div>
              </div>
              <div className="posts">
                  {/* avinash */}
                  <img src={image} alt="failed" />
              </div>
              <div className="reactions">
                  <Reactions contentID ={post.content_id}></Reactions>
              </div>
            </>
          );
        })}
      </div>
    );
}

export default Posts
