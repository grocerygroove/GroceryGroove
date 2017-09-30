import { hashChange } from '../components/page-actions';

let currentHash = null;

const getCurrent = function () {
  const hash = window.location.hash;
  return hash.indexOf("#") > -1 ? hash.split("#")[1] : '';
};

export const changeHash = function(hash) {    
  const current = window.location.href;
  window.location.href = hash ? current.replace(/#(.*)$/, '') + '#' + hash : current.indexOf("#")[0];
  return;
};

export const listenForHashChange = function (dispatch) {
  const current = getCurrent();
  if (current !== currentHash) {
    dispatch(hashChange(current));
    currentHash = current;
  }
  setTimeout(listenForHashChange.bind(this, dispatch), 200);
};
