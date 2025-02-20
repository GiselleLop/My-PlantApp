import { doc, onSnapshot } from "firebase/firestore";
import { auth, firestore, getRelativeTime, getUserData, handleComment } from "../../../../firebase";
import "./CommentModal.css"
import Notiflix from "notiflix"; 
import userImage1 from "../../../../assets/images/user.png";
import messageImg from "../../../../assets/images/message.png"

export async function renderCommentModal(postData, username) {
  const userId = auth.currentUser;   
  let imageProfile = userId.photoURL ? userId.photoURL : userImage1;

  const mainModal = document.createElement('div');
  mainModal.classList.add("mainCommentModal");
  mainModal.innerHTML = `
      <div class='modal_comment_content'>
        <div class="header_comment_modal">
          <h4 class='title_post_by'>Post by ${username}</h4>
          <button class='cancel_button'>X</button>
        </div>

        <div class="content_post_C"> 
          <p class="post_contain">${postData.description}</p>
        </div>

        <div class="container_comments_main">
          <div class="container_comments"></div>
          <div class="comment_user_container"> 
            <div class ="container_image_profile_user">
              <img src=${imageProfile} class="user_profile_photo">
            </div>

            <input type="text" class="input_to_comment">

            <button class="send_comment">
              <img src="${messageImg}" class="image_button_comment">    
            </button>
          </div>
        </div>
      </div>
  `;

  document.body.appendChild(mainModal);
  const closeModalButton = document.querySelector(".cancel_button");
  const sendCommentButton = document.querySelector(".send_comment");
  const inputComment = document.querySelector(".input_to_comment");
  const containerComments = document.querySelector(".container_comments");

  const postRef = doc(firestore, "post", postData.id);
  onSnapshot(postRef, async (docSnap) => {
    if (docSnap.exists()) {
      const comments = docSnap.data().comments || [];
      containerComments.innerHTML = "";

      if (comments.length > 0) {
        comments.forEach(async (comment) => {
          const userCommentData = await getUserData(comment.userId)
          const commentDiv = document.createElement("div");
          commentDiv.classList.add("main_comment_container");
          commentDiv.innerHTML = `
            <div class="comment_image_container">
              <img src=${userCommentData ? userCommentData.profile_image : '../../../assets/images/user.png'} class="profile_image_comment" />
            </div>
        
            <div class="comment_contain">
              <div class="comment_user_info">
                <p class="userName_comm">${userCommentData ? userCommentData?.username?.split(' ')[0] : 'Unknown user'}</p>
                <p class="date_comm">${comment.created_at ? getRelativeTime(comment.created_at): 'Unknown date'}</p>
              </div>
              <p class="comm_user_content"> ${comment.comment}</p>
            </div>
          `;
          containerComments.appendChild(commentDiv);
        });
      } else {
        containerComments.innerHTML = "<p class='no_comments'>No comments</p>";
      }
    }
  });

  closeModalButton.addEventListener("click", () => {
    mainModal.remove();
  });
  
  if (closeModalButton, sendCommentButton) {
    closeModalButton.addEventListener("click", () => {
    mainModal.remove();
    });
    sendCommentButton.addEventListener("click", () => {
      if (inputComment.value.trim() === '') {
        inputComment.classList.add('fadeOut');
        setTimeout(() => {
          inputComment.classList.remove('fadeOut');
        }, 1000);
        return;
      } else {
        handleComment(postData.id, userId.uid, inputComment.value.trim())
        .then(() => {
          inputComment.value = ''
          Notiflix.Notify.success("¡Guardado correctamente!");
        })
        .catch((error) => {
          Notiflix.Notify.failure("Ocurrió un error, inténtelo de nuevo más tarde");
        })
      }
    });
  
    
  }
  
  mainModal.addEventListener("click", (event) => {
    if (!event.target.closest(".modal_comment_content")) {
      mainModal.remove();
    }
  });
  return mainModal;
}