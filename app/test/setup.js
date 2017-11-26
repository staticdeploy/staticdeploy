// This polyfill must be set before require-ing enzyme libs
global.requestAnimationFrame = callback => {
    setTimeout(callback, 0);
};
require("ignore-styles");
require("ts-node/register");
require("jsdom-global/register");
const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

configure({ adapter: new Adapter() });
