const uuidv4 = require('uuid/v4');

export default {
  get() {
    let uuid = localStorage.getItem('userId');
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem('userId', uuid);
    }

    return uuid;
  },
};