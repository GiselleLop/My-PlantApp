import './Home.css'

function homePage(navigateTo) {
    const mainPage = document.createElement('div');
    mainPage.className = 'homePageWelcome';
    mainPage.innerHTML = `
      <img src="https://firebasestorage.googleapis.com/v0/b/social-network-c61c9.appspot.com/o/img%2Fplanta-arana.png?alt=media&token=836eab90-f526-44b6-b147-076dfff7cd62" class="homeplant" alt="Imagen de plantas">
        
      <div class="mainContainer">
          <div class='homeWelcomeAndText'>
            <h3 class="homeSubtitle">Welcome to</h3>
            <h1 class="homeTitle">My PlantApp</h1>
            <p class="homeSubtitle">A great community of plant and botany lovers.</p>
          </div>
  
          <div class="orderbuttons">
            <button class="registerButton">Sign up</button>
            <p class="homeSubtitle">Do you already have an account?</p>
            <button class="loginButton">Log in</button>
          </div>
        </div>
    `;
  
    mainPage.querySelector('.registerButton').addEventListener('click', () => {
      navigateTo('/register');
    });
  
    mainPage.querySelector('.loginButton').addEventListener('click', () => {
      navigateTo('/login');
    });
  
    return mainPage;
}
  
export default homePage;
  