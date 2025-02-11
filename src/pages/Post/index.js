import {
  auth,
  saveTask,
  initializeAuth,
  getUserData,
} from '../../firebase.js';
import { renderLogOutModal } from '../components/LogOutModal/index.js';
import { renderPostCard } from './components/PostContainer/index.js';
import "./Post.css"

export function postPage() {
  const mainPage = document.createElement('div');
  mainPage.setAttribute('class', 'homepagePosts');
  
  async function renderPost(postList) {
    const userId = auth.currentUser;
    const userData = await getUserData(userId.uid)
 
    let displayName = userId ? userData?.username?.split(' ')[0] : 'Unknown user';
    let imageProfile = userId.photoURL ? userId.photoURL : '../../assets/images/user.png';
  
    mainPage.innerHTML = `
      <div class="headerPost">
        <p class="header_title">My PlantApp</p>
        <img src="https://firebasestorage.googleapis.com/v0/b/social-network-c61c9.appspot.com/o/img%2Fplanta-arana.png?alt=media&token=836eab90-f526-44b6-b147-076dfff7cd62" class="logoImage" alt="Plantapp logo">
        <button class="logOutButton">
          <img src="../../assets/images/exit.png" alt="Log out">
        </button>
      </div>
      
      <div class="containerPublication">
        <div class='pictureAndUsername'>
          <div class ="container_image">
            <img src=${imageProfile} class="imagePublication" alt="Profile image">
          </div>
            
          <div>
            <p class='username'>${displayName}</p>
            <p class='email'>${userId.email}</p>
          </div>      
           <!--  <button class='editProfileButton'>Edit profile</button> -->
        </div>
          
        <form id="task-form">
          <textarea placeholder="Enter the content of the publication" id="inputDescription"></textarea>
          <div class='publication-alert-and-input-image'>
            <div class='image_and_post_container'>
              <span id="file-name">No hay imagen seleccionada</span> 
              <label for="post-image" class="camera-icon">
                <img src="../../assets/images/camera.png" alt="Cámara" />
                <input type="file" id="post-image" accept="image/*">
              </label>
              <button class="buttonSave">
                <span class="post-text">Post</span>
                <div id="loading-spinner" class="spinner hidden"></div>
              </button>

            </div>
          </div>    
        </form>
      </div>
      
      <div class="postView"></div>
    `;

      mainPage.querySelector('.postView').innerHTML = '';
  
      postList.forEach( async (doc) => {
        const postCard = await renderPostCard(doc)
        mainPage.querySelector('.postView').appendChild(postCard);
      });
  
      // const modal = document.getElementById('myModal');
      // const span = document.getElementsByClassName('close')[0];
      // const textModal = document.querySelector('.textOfModal');
      // const modalContent = document.querySelector('.modal-content');
  
      const contentModalEditProfile = document.createElement('div');
      contentModalEditProfile.classList = 'contentEditForm';
      contentModalEditProfile.innerHTML = `
      <h1 class='TitleEditProfile'> Edit Profile </h1>
      <form id="profileForm">
        <div>
          <label for="profileUserName">Change username:</label>
          <input type="text" id="profileUserName" placeholder="Username" value="${displayName}">
        </div>
  
        <div>
          <label for="profileImage">Change profile photo:</label>
          <input type="file" id="profileImage" accept="image/*">
        </div>
  
        <button type="submit" class="saveEditProfileButton">Save Info</button>
      </form>
     
      `;
        
      const imageInput = mainPage.querySelector('#post-image');
      imageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
          document.getElementById("file-name").textContent = file.name; 
        } else {
          document.getElementById("file-name").textContent = "No hay imagen seleccionada";
        }
      });

      // public post
      mainPage.querySelector('.buttonSave').addEventListener('click', (e) => {
        e.preventDefault();

        const postDescription = document.querySelector('#inputDescription');
        const containerPost = document.querySelector('#task-form');
        if (postDescription.value === '') {
          postDescription.classList.add('fadeOut');
          setTimeout(() => {
            postDescription.classList.remove('fadeOut');
          }, 1000);
          return;
        }
        
        document.querySelector(".buttonSave").disabled = true;
        document.querySelector(".post-text").textContent = "";
        document.getElementById("loading-spinner").classList.remove("hidden");

        saveTask(userId.uid, postDescription.value, imageInput.files[0]);
        containerPost.reset();
      });
  
      // edit profile
      // mainPage.querySelector('.editProfileButton').addEventListener('click', (e) => {
      //   e.preventDefault();
      //   modal.style.display = 'block';
      //   textModal.style.display = 'none';
      //   modalContent.append(contentModalEditProfile);
      //   const saveProfile = document.querySelector('.saveEditProfileButton');
  
      //   saveProfile.addEventListener('click', (f) => {
      //     f.preventDefault();
      //     modal.style.display = 'none';
      //     const fileInput = document.getElementById('profileImage');
      //     const file = fileInput.files[0] ? fileInput.files[0] : imageProfile;
      //     const nameuser = document.querySelector('#profileUserName').value;
      //     editUserProfile(nameuser, file);
      //   });
      //   span.onclick = function () {
      //     modal.style.display = 'none';
      //   };
      //   window.onclick = function (event) {
      //     if (event.target === modal) {
      //       modal.style.display = 'none';
      //     }
      //   };
      // });
  
      // evento cerrar sesion
      mainPage.querySelector('.logOutButton').addEventListener('click', () => {
        renderLogOutModal()
      });
  }

  initializeAuth(renderPost);
  return mainPage;
}
  