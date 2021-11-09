"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var FailedSuite = new src_1.Suite('failed');
FailedSuite.withTest('uhoh', src_1.Status.Failed, new Date('2021-11-09T00:21:26.836Z'), 123);
var PassedSuite = new src_1.Suite('passed');
PassedSuite.withTest('yay', src_1.Status.Passed, new Date('2021-11-09T00:21:26.836Z'), 123);
var SkippedSuite = new src_1.Suite('skipped');
SkippedSuite.withTest('nah', src_1.Status.Skipped, new Date('2021-11-09T00:21:26.836Z'), 123);
describe('computeStatus()', function () {
    var r = new src_1.TestRun();
    beforeEach(function () {
        r = new src_1.TestRun();
    });
    it('should return status of Skipped when no suites exist', function () {
        expect(r.computeStatus()).toBe(src_1.Status.Skipped);
    });
    it('should return status of Failed when at least one suite has Failed', function () {
        r.addSuite(PassedSuite);
        r.addSuite(SkippedSuite);
        r.addSuite(FailedSuite);
        expect(r.computeStatus()).toBe(src_1.Status.Failed);
    });
    it('should return status of Passed when all suites have Passed', function () {
        r.addSuite(PassedSuite);
        expect(r.computeStatus()).toBe(src_1.Status.Passed);
    });
    it('should return status of Skipped when all suites have Skipped', function () {
        r.addSuite(SkippedSuite);
        expect(r.computeStatus()).toBe(src_1.Status.Skipped);
    });
});
describe('stringify()', function () {
    it('renders correctly', function () {
        var r = new src_1.TestRun();
        r.addSuite(PassedSuite);
        expect(r).toMatchSnapshot();
    });
});
//# sourceMappingURL=run.test.js.map
