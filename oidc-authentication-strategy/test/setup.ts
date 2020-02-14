import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import nock from "nock";
import sinonChai from "sinon-chai";

// Setup chai plugins
chai.use(chaiAsPromised);
chai.use(sinonChai);

beforeEach(() => {
    nock.cleanAll();
});
