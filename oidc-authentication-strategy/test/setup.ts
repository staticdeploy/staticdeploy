import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import nock from "nock";

// Setup chai plugins
chai.use(chaiAsPromised);

beforeEach(() => {
    nock.cleanAll();
});
