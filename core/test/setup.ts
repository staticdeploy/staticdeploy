import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import deepEqualInAnyOrder from "deep-equal-in-any-order";
import sinonChai from "sinon-chai";

// Setup chai plugins
chai.use(chaiAsPromised);
chai.use(deepEqualInAnyOrder);
chai.use(sinonChai);
