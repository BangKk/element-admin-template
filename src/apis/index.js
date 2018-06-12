import { get, post } from './ajax';

export default {
  login(data) {
    // return post(`Passport/User/Login`, data);
    return Promise.resolve({
      name: 'admin',
      action_list: [
        {
          action_code: 'Router:user'
        },
        {
          action_code: 'Router:user1'
        },
        {
          action_code: 'Router:order'
        }
      ]
    });
  },
  logout() {
    return get(`auth/logout`);
  },
  me() {
    // return get(`auth/me`);
    return Promise.resolve({
      name: 'admin',
      action_list: [
        {
          action_code: 'Router:user'
        },
        {
          action_code: 'Router:user1'
        },
        {
          action_code: 'Router:order'
        }
      ]
    });
  }
};
