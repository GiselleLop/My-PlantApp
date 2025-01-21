import "./Login.css"
import { GoogleRegister, login } from "../../firebase";

function loginPage(navigateTo) {
  const mainPage = document.createElement('div');
  mainPage.classList.add('homepageLogin');
  mainPage.innerHTML = `
    
      <div class="imageAndTextRegister">
        <h1 class="titleLogin">We are glad to see you again!</h1>
        <h2 class="titleLogin">Enter your details</h2>
        <img src="https://firebasestorage.googleapis.com/v0/b/social-network-c61c9.appspot.com/o/img%2Fregadera.png?alt=media&token=b6994595-5975-4a79-a110-686525ba4d5f" style="width: 55%; height: auto;">
      </div>

      <form id="input-container">
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
        <img src="https://firebasestorage.googleapis.com/v0/b/social-network-c61c9.appspot.com/o/img%2Fgoogleongpng.webp?alt=media&token=0bf583ce-00aa-467b-9101-654e9fe9aabd" class="imgGoogle">
        Log In with Google
        </button>

        <button id="return">Return</button>

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

  mainPage.querySelector('#return').addEventListener('click', () => {
    navigateTo('/');
  });

  return mainPage;
}
export default loginPage;
