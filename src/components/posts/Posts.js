import React from 'react'
import image from '../../images/image3.jpg'
import image1 from '../../images/image2.jpg'
import Reactions from '../reactions/Reactions'
import './posts.css'
var posts = [
    {
      content_id: 1,
      first_name: "Lizette",
      last_name: "Phippen",
      email: "lphippen0@berkeley.edu",
      avatar: image1,
    },
    {
      content_id: 2,
      first_name: "Garreth",
      last_name: "Heikkinen",
      email: "gheikkinen1@naver.com",
      avatar: image1,
    },
  ];
const Posts = () => {
    return (
      <div id="posts" className="posts-container">
        {posts.map((post) => {
          return (
            <React.Fragment key={post.content_id}>
              <div  className="post-outer">
                <div className="avatar">
                  <img srcSet={post.avatar} alt="" />
                </div>
                <div className="user-name">{post.first_name}</div>
              </div>
              <div className="posts">
                  <img srcSet={image} alt="" />
              </div>
              <div className="reactions">
                  <Reactions contentID ={post.content_id}></Reactions>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
}

export default Posts
