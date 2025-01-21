import { posts } from '../src/post.js';
import * as firebase from '../src/firebase.js';
import renderLogin from '../src/login.js';

describe('Usuario autenticado', () => {
  it('Inicia sesión correctamente', () => {
    // Mock de la función onAuthStateChanged de firebase
    jest.spyOn(firebase, 'initializeAuth').mockImplementation((callback) => {
      // Simula un usuario no autenticado
      callback(null);
    });
    // Mock de la función de navegación
    const navigateTo = jest.fn();

    // Mock de la función signInWithEmailAndPassword de firebase
    jest.spyOn(firebase, 'login').mockResolvedValueOnce({});

    // Renderiza el componente
    const mainPage = document.createElement('div');
    mainPage.append(renderLogin(navigateTo));
    document.body.append(mainPage);
    // Simula el inicio de sesión
    const loginEmail = mainPage.querySelector('#emailLog');
    loginEmail.value = 'holahola@holahola.com';
    const loginPassword = mainPage.querySelector('#passwordLogin');
    loginPassword.value = 'holaholahola';
    const buttonLogin = mainPage.querySelector('#sessionBtn');
    buttonLogin.click();

    // Verifica que la función de inicio de sesión se haya llamado correctamente
    expect(firebase.login).toHaveBeenCalledTimes(1);

    // Verifica que la función de navegación se haya llamado después de iniciar sesión
    // expect(navigateTo).toHaveBeenCalledWith('/posts');
  });
});

describe('posts', () => {
  it('Should be a function', () => {
    expect(typeof posts).toBe('function');
  });
  it('Have a button to log out', () => {
    const DOM = document.createElement('div');
    document.body.appendChild(DOM);
    DOM.append(posts());
    const haveAbutton = DOM.querySelector('.logOutButton');
    expect(haveAbutton).not.toBe(undefined);
  });
  it('Have a container to posts', () => {
    const DOM = document.createElement('div');
    DOM.append(posts());
    const containerPosts = DOM.querySelector('.postView');
    expect(containerPosts).not.toBe(undefined);
  });
  it('Have a form to public post', () => {
    const DOM = document.createElement('div');
    DOM.append(posts());
    const createPosts = DOM.querySelector('#task-form');
    expect(createPosts).not.toBe(undefined);
  });
  it('Post have a button to delete', () => {
    const DOM = document.createElement('div');
    DOM.append(posts());
    const buttonDelete = DOM.querySelector('.deleteButton');
    expect(buttonDelete).not.toBe(undefined);
  });
  it('Post have a button to edit', () => {
    const DOM = document.createElement('div');
    document.body.append(DOM);
    DOM.append(posts());
    const buttonEdit = DOM.querySelector('.editButton');
    expect(buttonEdit).not.toBe(undefined);
  });
  it('Snapshot of posts', () => {
    const DOM = document.createElement('div');
    DOM.append(posts());
    expect(DOM).toMatchSnapshot();
  });
});
