import {TestRun, Status, Suite} from "../src";

const FailedSuite = new Suite('failed')
FailedSuite.withTest('uhoh', Status.Failed, new Date('2021-11-09T00:21:26.836Z'), 123)

const PassedSuite = new Suite('passed')
PassedSuite.withTest('yay', Status.Passed, new Date('2021-11-09T00:21:26.836Z'), 123)

const SkippedSuite = new Suite('skipped')
SkippedSuite.withTest('nah', Status.Skipped, new Date('2021-11-09T00:21:26.836Z'), 123)

describe('computeStatus()', function () {
    let r = new TestRun()

    beforeEach(
        function () {
            r = new TestRun()
        }
    )

    it('should return status of Skipped when no suites exist', function () {
        expect(r.computeStatus()).toBe(Status.Skipped)
    });

    it('should return status of Failed when at least one suite has Failed', function () {
        r.addSuite(PassedSuite)
        r.addSuite(SkippedSuite)
        r.addSuite(FailedSuite)
        expect(r.computeStatus()).toBe(Status.Failed)
    })

    it('should return status of Passed when all suites have Passed', function () {
        r.addSuite(PassedSuite)
        expect(r.computeStatus()).toBe(Status.Passed)
    })

    it('should return status of Skipped when all suites have Skipped', function () {
        r.addSuite(SkippedSuite)
        expect(r.computeStatus()).toBe(Status.Skipped)
    })
});

describe('stringify()', function () {
    it('renders correctly', function () {
        let r = new TestRun()
        r.addSuite(PassedSuite)
        expect(r).toMatchSnapshot()
    })
})
