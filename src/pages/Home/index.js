import './Home.css'

function homePage(navigateTo) {
    const mainPage = document.createElement('div');
    mainPage.className = 'mainHomeContainer';
    mainPage.innerHTML = `
      <img src="https://firebasestorage.googleapis.com/v0/b/social-network-c61c9.appspot.com/o/img%2Fplanta-arana.png?alt=media&token=836eab90-f526-44b6-b147-076dfff7cd62" class="home_image" alt="Imagen de plantas">
        
      <div class="welcome_container">
         
          <div class='homeWelcomeAndText'>
            <p class="homeSubtitle">Welcome to</p>
            <h1 class="homeTitle">My PlantApp</h1>
            <p class="homeSubtitle">A great community of plant and botany lovers.</p>
          </div>
  
          <div class="buttons_container">
            <button class="home_button" id="register_button">Sign Up</button>
            <p class="homeSubtitle">Do you already have an account?</p>
            <button class="home_button" id="login_button">Log In</button>
          </div>
        </div>
    `;
  
    mainPage.querySelector('#register_button').addEventListener('click', () => {
      navigateTo('/register');
    });
  
    mainPage.querySelector('#login_button').addEventListener('click', () => {
      navigateTo('/login');
    });
  
    return mainPage;
}
  
export default homePage;
  