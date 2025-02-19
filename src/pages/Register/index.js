import { createUser, GoogleRegister } from '../../firebase.js';
import "./Register.css"
import backImage from "../../assets/images/back.png";
function registerPage(navigateTo) {
  const mainPage = document.createElement('div');
  mainPage.classList.add('homePageRegister');
  mainPage.innerHTML = `
    <button class="back_button">
      <img src="${backImage}" width=60% height=auto/>
    </button>

    <div class="imageAndTextRegister">
      <p>To create a new account, enter your details.</p>
      <img src="https://firebasestorage.googleapis.com/v0/b/social-network-c61c9.appspot.com/o/img%2Fevolucion.png?alt=media&token=2169c4ff-1063-488c-818a-e86c115b9b36" class="image_register_">
    </div>
     
    <form id="input-container">
      <div>
        <label for="usernameRegister">Username:</label>
        <input type="text" id="usernameRegister" name="username" autocomplete="username">
      </div>
    
      <div>
        <label for="emailRegister">Email:</label>
        <input type="email" id="emailRegister" name="email" autocomplete="email">
      </div>
        
      <div>
        <label for="passwordRegister">Password:</label>
        <input type="password" id="passwordRegister" name="password" autocomplete="current-password">
      </div>
      <span id="answerPass"></span>
      <button id="signUp"> Sign up </button>
      <button id="google">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896" focusable="false" class="anticon anticon-google" fill="currentColor" aria-hidden="true" width="25px" height="25px">
          <path d="M878.1 472.9H841V472H512v80h208.1C699 639.9 612.3 704 512 704c-130.1 0-236-105.9-236-236s105.9-236 236-236c60.2 0 114.8 22.3 156.8 58.9l59.6-59.6C652.5 182.7 584.6 152 512 152 324.3 152 176 300.3 176 488s148.3 336 336 336c181.7 0 324-147.4 324-328 0-21.7-2.4-42.8-6.9-63.1z"/>
        </svg>
        Sign up with Google
      </button>
    </form>
  `;

  mainPage.querySelector('.back_button').addEventListener('click', () => {
    navigateTo('/');
  });

  mainPage.querySelector('#signUp').addEventListener('click', (e) => {
    e.preventDefault();
    const signUpEmail = document.querySelector('#emailRegister').value;
    const signPassword = document.querySelector('#passwordRegister').value;
    const signUsername = document.querySelector('#usernameRegister').value;

    createUser(signUpEmail, signPassword, signUsername)
      .then((ok) => {
        const spanPassword = document.querySelector('#answerPass');
        spanPassword.classList.add(ok.message);
        spanPassword.textContent = `${ok.message} ${ok.email} Saved`;
        navigateTo('/posts');
      })
      .catch((err) => {
        const spanPassword = document.querySelector('#answerPass');
        spanPassword.classList.add('error');
        if (err.code === 'auth/invalid-email' || err === 'auth/invalid-username') {
          spanPassword.textContent = 'Ingresa un email o nombre de usuario válido';
        }
        if (err.code === 'auth/missing-email') {
          spanPassword.textContent = 'Por favor ingresa un email';
        }
        if (err.code === 'auth/weak-password') {
          spanPassword.textContent = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (err.code === 'auth/email-already-in-use') {
          spanPassword.textContent = 'El email ya se encuentra en uso';
        }
      });
  });

  mainPage.querySelector('#google').addEventListener('click', (e) => {
    e.preventDefault();
    GoogleRegister(navigateTo);
  });

  return mainPage;
}

export default registerPage;
