process.env.NO_COLOR = 'true';
import homePage from '../src/pages/Home/index.js';
import loginPage from './pages/Login/index.js';
import { postPage } from './pages/Post/index.js';
import registerPage from './pages/Register/index.js';

const routes = [
  { path: '/', component: homePage },
  { path: '/login', component: loginPage },
  { path: '/register', component: registerPage },
  { path: '/posts', component: postPage },
];

const mainPage = document.querySelector('.root');
const defaultRoute = '/';

export function navigateTo(hash) {
  const route = routes.find((r) => r.path === hash);

  if (route && route.component) {
    window.history.pushState(
      {},
      route.path,
      window.location.origin + route.path,
    );

    if (mainPage.firstChild) {
      mainPage.removeChild(mainPage.firstChild);
      mainPage.append(route.component(navigateTo));
    } else {
      navigateTo('/error');
    }
  }
}

window.addEventListener('popstate', () => {
  navigateTo(defaultRoute);
});

function initRouter() {
  navigateTo(window.location.pathname || defaultRoute);
}

initRouter();
export default navigateTo;
