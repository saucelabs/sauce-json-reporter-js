"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var Skipped = { status: src_1.Status.Skipped };
var Passed = { status: src_1.Status.Passed };
var Failed = { status: src_1.Status.Failed };
describe('finalStatus()', function () {
    it('should determine status correctly', function () {
        // parent, child, expected
        var cases = [
            [Skipped, Skipped, Skipped],
            [Skipped, Passed, Passed],
            [Skipped, Failed, Failed],
            [Passed, Passed, Passed],
            [Passed, Skipped, Passed],
            [Passed, Failed, Failed],
            [Failed, Failed, Failed],
            [Failed, Skipped, Failed],
            [Failed, Failed, Failed],
        ];
        for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
            var _a = cases_1[_i], parent_1 = _a[0], child = _a[1], expected = _a[2];
            expect((0, src_1.statusOf)(parent_1, child)).toBe(expected.status);
        }
    });
});
//# sourceMappingURL=status.test.js.map
