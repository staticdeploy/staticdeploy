import chai from "chai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import "ignore-styles";
import jsdomGlobal from "jsdom-global";
import sinonChai from "sinon-chai";

// Setup dayjs
dayjs.extend(relativeTime);

// Setup jsdom
jsdomGlobal(undefined, { pretendToBeVisual: true });
(global as any).requestAnimationFrame = (global as any).window.requestAnimationFrame;
(global as any).cancelAnimationFrame = (global as any).window.cancelAnimationFrame;

// Setup enzyme
configure({ adapter: new Adapter() });

// Setup chai
chai.use(sinonChai);
