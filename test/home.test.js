/**
 * @jest-environment jsdom
 */
import home from '../src/home.js';

describe('home', () => {
  it('Should be a function', () => {
    expect(typeof home).toBe('function');
  });
  it('Have a button to Login', () => {
    const DOM = document.createElement('div');
    DOM.append(home());
    const haveAbutton = DOM.querySelector('#loginButton');
    expect(haveAbutton).not.toBe(undefined);
  });
  it('Have a button to register', () => {
    const DOM = document.createElement('div');
    DOM.append(home());
    const haveAbutton = DOM.querySelector('#registerButton');
    expect(haveAbutton).not.toBe(undefined);
  });
  it('After click button return call function navigateTo with /login', () => {
    const DOM = document.createElement('div');
    const navigateTo = jest.fn();
    DOM.append(home(navigateTo));
    const haveAbuttonLogin = DOM.querySelector('#loginButton');
    haveAbuttonLogin.click();
    expect(navigateTo).toHaveBeenLastCalledWith('/login');
  });
  it('After click button return call function navigateTo with /register', () => {
    const DOM = document.createElement('div');
    const navigateTo = jest.fn();
    DOM.append(home(navigateTo));
    const haveAbuttonRegister = DOM.querySelector('#registerButton');
    haveAbuttonRegister.click();
    expect(navigateTo).toHaveBeenLastCalledWith('/register');
  });
  it('Snapshot of home', () => {
    const DOM = document.createElement('div');
    DOM.append(home());
    expect(DOM).toMatchSnapshot();
  });
});
