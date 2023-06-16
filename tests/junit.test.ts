import {TestRun, Status} from '../src'

describe('toJUnitObj', function () {
    const run = new TestRun();

    beforeEach(function() {
        const s1 = run.withSuite('somegroup')
        const s2 = s1.withSuite('somefile.test.js')
        s2.withTest('yay', {
            status: Status.Passed,
            duration: 123,
        })
        s2.withTest('nay', {
            status: Status.Failed,
            output: 'test failed',
            duration: 123,
        })
    })

    it('should convert to JUnit object', function() {
        const jObj = run.toJUnitObj()
        expect(jObj.testsuite.length).toBe(2)
        expect(jObj.testsuite[0].testcase.length).toBe(0)
        expect(jObj.testsuite[1].testcase.length).toBe(2)
    })
})