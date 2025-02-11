import "./Login.css"
import { GoogleRegister, login } from "../../firebase";

function loginPage(navigateTo) {
  const mainPage = document.createElement('div');
  mainPage.classList.add('homepageLogin');
  mainPage.innerHTML = `
    <button class="back_button">
        <img src="../../assets/images/back.png" width=60% height=auto/>
      </button>

      <div class="imageAndTextlogin">
        <p>We are glad to see you again!</p>
        <p>Enter your details</p>
        <img src="https://firebasestorage.googleapis.com/v0/b/social-network-c61c9.appspot.com/o/img%2Fregadera.png?alt=media&token=b6994595-5975-4a79-a110-686525ba4d5f" class="image_login1_">
      </div>

      <form id="input-login-container">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email">
        </div>

        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password">
        </div>
        <span id="answerPass"></span>
  
        <button id="log-in-button">Log In</button>
    
        <button id="google">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896" focusable="false" class="anticon anticon-google" fill="currentColor" aria-hidden="true" width="25px" height="25px">
          <path d="M878.1 472.9H841V472H512v80h208.1C699 639.9 612.3 704 512 704c-130.1 0-236-105.9-236-236s105.9-236 236-236c60.2 0 114.8 22.3 156.8 58.9l59.6-59.6C652.5 182.7 584.6 152 512 152 324.3 152 176 300.3 176 488s148.3 336 336 336c181.7 0 324-147.4 324-328 0-21.7-2.4-42.8-6.9-63.1z"/>
        </svg>
        Log In with Google
        </button>
      </form>
  `;

  mainPage.querySelector('#log-in-button').addEventListener('click', (e) => {
    e.preventDefault();
    const loginEmail = document.querySelector('#email').value;
    const loginPassword = document.querySelector('#password').value;

    login(loginEmail, loginPassword)
      .then((ok) => {
        const spanPassword = document.querySelector('#answerPass');
        spanPassword.classList.add(ok.message);
        spanPassword.textContent = `${ok.message} ${ok.email} Saved`;
        navigateTo('/posts');
      })
      .catch((err) => {
        const spanPassword = document.querySelector('#answerPass');
        if (err.code === 'auth/invalid-email') {
          spanPassword.classList.add('error');
          spanPassword.textContent = 'Ingresa un email válido';
        }
        if (err.code === 'auth/invalid-login-credentials') {
          spanPassword.classList.add('error');
          spanPassword.textContent = 'Contraseña incorrecta';
        }
      });
  });

  mainPage.querySelector('#google').addEventListener('click', (e) => {
    e.preventDefault();
    GoogleRegister(navigateTo);
  });

  mainPage.querySelector('.back_button').addEventListener('click', () => {
    navigateTo('/');
  });

  return mainPage;
}
export default loginPage;
