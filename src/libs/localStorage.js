export default {
  get: item => JSON.parse(window.localStorage.getItem(item)),
  set: (key, value) => window.localStorage.setItem(key, JSON.stringify(value)),
  clear: item => window.localStorage.clear(item)
};
