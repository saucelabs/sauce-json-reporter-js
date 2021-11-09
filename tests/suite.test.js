"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var FailedTest = new src_1.Test('failed', src_1.Status.Failed);
var PassedTest = new src_1.Test('passed', src_1.Status.Passed);
var SkippedTest = new src_1.Test('skipped', src_1.Status.Skipped);
describe('computeStatus()', function () {
    var s;
    beforeEach(function () {
        s = new src_1.Suite('testing compute');
    });
    it('should return status of Skipped when no tests exist', function () {
        expect(s.computeStatus()).toBe(src_1.Status.Skipped);
    });
    it('should return status of Failed when at least one test has Failed', function () {
        s.addTest(FailedTest);
        s.addTest(SkippedTest);
        s.addTest(PassedTest);
        expect(s.computeStatus()).toBe(src_1.Status.Failed);
    });
    it('should return status of Passed when all tests have Passed', function () {
        s.addTest(PassedTest);
        expect(s.computeStatus()).toBe(src_1.Status.Passed);
    });
    it('should return status of Skipped when all suites have Skipped', function () {
        s.addTest(SkippedTest);
        expect(s.computeStatus()).toBe(src_1.Status.Skipped);
    });
});
//# sourceMappingURL=suite.test.js.map
