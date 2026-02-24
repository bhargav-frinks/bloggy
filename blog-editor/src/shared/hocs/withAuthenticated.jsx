import Cookies from 'js-cookie';

export const getCookie = () => Cookies.get('token');
export const setCookie = (token) => Cookies.set('token', token, { expires: 7 }); // expires in 7 days
export const removeCookie = () => Cookies.remove('token');
