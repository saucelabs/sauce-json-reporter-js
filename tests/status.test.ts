import {statusOf, Status} from "../src"

const Skipped = {status: Status.Skipped}
const Passed = {status: Status.Passed}
const Failed = {status: Status.Failed}

describe('finalStatus()', function () {
    it('should determine status correctly', function () {
        // parent, child, expected
        const cases = [
            [Skipped, Skipped, Skipped],
            [Skipped, Passed, Passed],
            [Skipped, Failed, Failed],

            [Passed, Passed, Passed],
            [Passed, Skipped, Passed],
            [Passed, Failed, Failed],

            [Failed, Failed, Failed],
            [Failed, Skipped, Failed],
            [Failed, Failed, Failed],
        ]

        for (const [parent, child, expected] of cases) {
            expect(statusOf(parent, child)).toBe(expected.status)
        }
    })
})
