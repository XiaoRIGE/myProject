const files = require.context('./', false, /\.js$/);
const modules = {};
files.keys().forEach(key => {
  if (key === './index.js') return;
  const moduleName = key.replace(/(\.\/|\.js)/g, '');
  const module = files(key).default;
  if (!module['namespaced']) module.namespaced = true;
  modules[moduleName] = files(key).default;
});
export default modules;
