import fastSafeJsonStringify from "../src/fastSafeJsonStringify";

describe("fastSafeJsonStringify", () => {
    describe("stringifies any object without throwing errors", () => {
        it("case: simple object", () => {
            fastSafeJsonStringify({});
        });

        it("case: object with circular references", () => {
            const obj: any = {};
            obj.self = obj;
            fastSafeJsonStringify(obj);
        });
    });
});
