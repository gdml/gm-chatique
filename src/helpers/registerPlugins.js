/*
 * Load all files from ../plugins folder with given context
 *
 * For details, check out https://webpack.js.org/guides/dependency-management/#context-module-api
 *
 */
export default (ctx) => {
  const plugins = [];

  function importAll(r) {
    r.keys().forEach((key) => plugins.push(r(key)));
  }

  importAll(require.context('../plugins/', false, /.*\.js$/));

  plugins.forEach((plugin) => (plugin.default ? plugin.default(ctx) : null));
};
