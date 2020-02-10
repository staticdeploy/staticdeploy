import { expect } from "chai";
import sinon from "sinon";

import GetSupportedExternalCacheTypes from "../../src/usecases/GetSupportedExternalCacheTypes";
import { getMockDependencies } from "../testUtils";

describe("usecase GetSupportedExternalCacheTypes", () => {
    it("returns a list of the supported external cache types", async () => {
        const mockExternalCacheTypes = [
            { name: "type0", label: "label0", configurationFields: [] },
            { name: "type1", label: "label1", configurationFields: [] },
            { name: "type2", label: "label2", configurationFields: [] }
        ];
        const deps = getMockDependencies();
        deps.externalCacheServices = mockExternalCacheTypes.map(
            externalCacheType => ({
                externalCacheType: externalCacheType,
                purge: sinon.stub()
            })
        );
        const getSupportedExternalCacheTypes = new GetSupportedExternalCacheTypes(
            deps
        );
        const externalCacheTypes = await getSupportedExternalCacheTypes.exec();
        expect(externalCacheTypes).to.deep.equal(mockExternalCacheTypes);
    });
});
