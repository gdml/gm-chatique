import api from '../api';

export default (context) => {
  const obj = {};

  Object.entries(api).forEach(([name, fn]) => {
    obj[name] = (payload) => fn(context, payload);
  });

  // eslint-disable-next-line no-param-reassign
  context.Vue.prototype.$gmChatique = obj;
};
