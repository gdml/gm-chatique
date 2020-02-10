import storeModule from '../store';

export default ({ store }) => {
  store.registerModule('gmChat', storeModule);
};
