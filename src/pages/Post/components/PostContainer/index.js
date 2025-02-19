import { auth, deletePost, getRelativeTime, getUserData, handleLike } from "../../../../firebase";
import { renderEditPostModal } from "../EditPostModal";
import { renderModalConfirm } from "../../../components/ModalConfirm"
import "./PostContainer.css"
import { renderCommentModal } from "../CommentModal";

import userImage1 from "../../../../assets/images/user.png";
import heartImage from "../../../../assets/images/heart.png"
import heartFullImage from "../../../../assets/images/heartfull.png"
import chatImage from  "../../../../assets/images/chat.png"

export async function renderPostCard(postData) {
  const userId = auth.currentUser;    
  const userData = await getUserData(postData.userId)
  const imageProfile =  userData.profile_image &&  userData.profile_image  !== "" ?  userData.profile_image  : userImage1;

  const postCard = document.createElement('div');
  postCard.classList.add('ListGroupItem');
  postCard.innerHTML = `    
    <div class='header_post'> 
      <div class="post_info_container">
        <div class="profile_image_container">
          <img src="${imageProfile}" class="profile_image" />
        </div>
        <div class="name_date_container">
          <p class="userName_post">${userData ? userData?.username?.split(' ')[0] : 'Unknown user'}</p>
          <p class="date_post">${postData.created_at ? getRelativeTime(postData.created_at): 'Unknown date'}</p>
        </div>
      </div>
      
      ${postData.userId.includes(userId.uid)? `
        <div class="menu-container">
        <button id="menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor" width="25px" height="25px">
            <path d="M256 512a64 64 0 1 1 128 0 64 64 0 1 1-128 0zm192 0a64 64 0 1 1 128 0 64 64 0 1 1-128 0zm192 0a64 64 0 1 1 128 0 64 64 0 1 1-128 0z"/>
          </svg>
        </button>
        <div id="menu" class="menu">
          <button id="edit-btn">Edit post</button>
          <button id="delete-btn">Delete post</button>
        </div>
      </div>` : ""} 
      
    </div>

    <div class='post-contain'>
      <p class='postDescription'>${postData.description}</p>
      ${postData.image ? `<img src="${postData.image}" alt="Post image" class="imgPostPublication">` : ""} 
    </div>


    <div class="container_likes_comments">
    <div class="container_first"">
      <button class="button_first" id="button_like_first">
        <img src=".${heartImage}" class='imgLike' id='likeButton'>
      </button>
      <span>${postData.likes}</span>
    </div>

    <div class="container_first">
      <button class="button_first" id="button_commemt_first">
        <img src="${chatImage}" class='imgChat' id='commentChat'>
      </button>
      <span>${postData.comments ? postData.comments.length : 0}</span>
    </div>
  </div>
  `;
  
  const likedBy = postData.likedBy;
  if (likedBy && likedBy.includes(userId.uid)) {
    const likeButton = postCard.querySelector('.imgLike');
    if (likeButton) {
      likeButton.src = heartFullImage;
    }
  }

  const menuBtn = postCard.querySelector('#menu-btn');
  const menu = postCard.querySelector('#menu') ?  postCard.querySelector('#menu') : null;
  menuBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    menu.classList.toggle("active");
  });
 
  document.addEventListener('click', (event) => {
    if (!menu?.contains(event.target) && event.target !== menuBtn) {
      menu?.classList.remove("active");
    }
  });
   // Event Like
  postCard.querySelector('#button_like_first').addEventListener('click', (e) => {
    handleLike(postData.id, userId.uid);
  });
  
 // Event comment
 postCard.querySelector('#button_commemt_first')?.addEventListener('click', (e) => {
  e.preventDefault()
  renderCommentModal(postData, userData?.username?.split(' ')[0])
});

  // Edit Post
  postCard.querySelector('#edit-btn')?.addEventListener('click', (e) => {
    e.preventDefault()
    renderEditPostModal(postData)
  });
  //Delete post
  postCard.querySelector('#delete-btn')?.addEventListener('click', (e) => {
    renderModalConfirm(
      postData.id, 
      "Delete post", 
      "Are you sure you want to delete this post? Changes are not reversible", 
      deletePost 
    )
  });


  return postCard
}