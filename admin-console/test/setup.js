require("ts-node/register");
// Must be required after ts-node/register
require("ignore-styles");

// Setup jsdom
const jsdomGlobal = require("jsdom-global");
jsdomGlobal(undefined, { pretendToBeVisual: true });
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;

// Setup enzyme
const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
configure({ adapter: new Adapter() });

// Setup chai
const chai = require("chai");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
