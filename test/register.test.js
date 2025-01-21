/**
 * @jest-environment jsdom
 */

import renderCreateAccount from '../src/register.js';
import * as firebase from '../src/firebase.js';

describe('renderCreateAccount', () => {
  it('Should be a function', () => {
    expect(typeof renderCreateAccount).toBe('function');
  });
  it('Have a button to return', () => {
    const DOM = document.createElement('div');
    DOM.append(renderCreateAccount());
    const haveAbutton = DOM.querySelector('#return');
    expect(haveAbutton).not.toBe(undefined);
  });
  it('Have a button to register with Google', () => {
    const DOM = document.createElement('div');
    DOM.append(renderCreateAccount());
    const haveAbuttonGoogle = DOM.querySelector('.buttonRegister');
    expect(haveAbuttonGoogle).not.toBe(undefined);
  });
  it('After click button return call function navigateTo with /', () => {
    const DOM = document.createElement('div');
    const navigateTo = jest.fn();
    DOM.append(renderCreateAccount(navigateTo));
    const haveAbuttonReturn = DOM.querySelector('#return');
    haveAbuttonReturn.click();
    expect(navigateTo).toHaveBeenLastCalledWith('/');
  });
  it('Snapshot of register', () => {
    const DOM = document.createElement('div');
    DOM.append(renderCreateAccount());
    expect(DOM).toMatchSnapshot();
  });
});

describe('Button register', () => {
  it('test of click button register', () => {
    const DOM = document.createElement('div');
    document.body.appendChild(DOM);
    DOM.append(renderCreateAccount());
    jest.spyOn(firebase, 'createUser').mockImplementation(() =>
    // eslint-disable-next-line
      Promise.resolve({
        message: 'success',
        email: 'giselle@lopez.com',
      }));

    // jest.spyOn(auth, 'login').mockImplementation(() => Promise.resolve({
    // message: 'success', email: 'giselle@holaLopez.com' }))
    const buttonRegister = DOM.querySelector('#continue');
    const email = DOM.querySelector('#emailRegister');
    email.value = 'giselle@holaLopez.com';
    const password = DOM.querySelector('#passwordRegister');
    password.value = 'hola123';
    // await Promise.resolve();
    buttonRegister.click();
    expect(firebase.createUser).toHaveBeenCalledTimes(1);
    // loginSpy.mockRestore();
  });
});
