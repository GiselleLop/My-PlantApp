import { auth, deletePost, getRelativeTime, getUserData, handleLike } from "../../../../firebase";
import { renderEditPostModal } from "../EditPostModal";
import { renderModalConfirm } from "../../../components/ModalConfirm"
import "./PostContainer.css"
import { renderCommentModal } from "../CommentModal";

export async function renderPostCard(postData) {
  const userId = auth.currentUser;    
  const userData = await getUserData(postData.data().userId)
  const postCard = document.createElement('div');
  postCard.classList.add('ListGroupItem');
  postCard.innerHTML = `    
    <div class='header_post'> 
      <div class="post_info_container">
        <div class="profile_image_container">
          <img src=${userData ? userData.profile_image : '../../../assets/images/user.png'} class="profile_image" />
        </div>
        <div class="name_date_container">
          <p class="userName_post">${userData ? userData?.username?.split(' ')[0] : 'Unknown user'}</p>
          <p class="date_post">${postData.data().created_at ? getRelativeTime(postData.data().created_at): 'Unknown date'}</p>
        </div>
      </div>
      
      ${postData.data().userId.includes(userId.uid)? `
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
      <p class='postDescription'>${postData.data().description}</p>
      ${postData.data().image ? `<img src="${postData.data().image}" alt="Post image" class="imgPostPublication">` : ""} 
    </div>


    <div class="container_likes_comments">
    <div class="container_first"">
      <button class="button_first" id="button_like_first">
        <img src="../../../assets/images/heart.png" class='imgLike' id='likeButton'>
      </button>
      <span>${postData.data().likes}</span>
    </div>

    <div class="container_first">
      <button class="button_first" id="button_commemt_first">
        <img src="../../../assets/images/chat.png" class='imgChat' id='commentChat'>
      </button>
      <span>${postData.data().comments ? postData.data().comments.length : 0}</span>
    </div>
  </div>
  `;
  
  const likedBy = postData.data().likedBy;
  if (likedBy && likedBy.includes(userId.uid)) {
    // El documento tiene la propiedad likedBy y el usuario ya ha dado like
    const likeButton = postCard.querySelector('.imgLike');
    if (likeButton) {
      likeButton.src = '../../../assets/images/heartfull.png';
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
    //  e.preventDefault()
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