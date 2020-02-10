import registerStore from './helpers/registerStore';
import registerPlugins from './helpers/registerPlugins';
import registerComponent from './helpers/registerComponent';
import registerApi from './helpers/registerApi';

export default (Vue, options) => {
  const context = {
    Vue,
    store: options.store,
  };

  registerStore(context);
  registerPlugins(context);
  registerComponent(context);
  registerApi(context);
};
