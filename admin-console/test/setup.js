require("ts-node/register");
// Must be required after ts-node/register
require("ignore-styles");
require("jsdom-global/register");

// This polyfill must be set before require-ing enzyme libs
global.requestAnimationFrame = callback => {
    setTimeout(callback, 0);
};
const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
configure({ adapter: new Adapter() });

const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
