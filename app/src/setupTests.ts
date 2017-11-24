/* tslint:disable */
// This polyfill must be set before require-ing enzyme libs
// TODO: remove once jest issue #4545 is resolved
(global as any).requestAnimationFrame = (callback: any) => {
    setTimeout(callback, 0);
};

const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

configure({ adapter: new Adapter() });
