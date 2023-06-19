import {TestRun, Status} from '../src'

describe('toJUnitObj', function () {
    const run = new TestRun();

    beforeEach(function() {
        const s1 = run.withSuite('somegroup')
        const s2 = s1.withSuite('somefile.test.js')
        s2.withTest('yay', {
            status: Status.Passed,
            duration: 123,
            attachments: [
              {name: 'video.mp4', path: './video.mp4', contentType: 'video/mp4'},
            ],
          })
          s2.withTest('nay', {
            status: Status.Failed,
            output: 'test failed',
            duration: 123,
            attachments: [
              {name: 'video.mp4', path: './video.mp4', contentType: 'video/mp4'},
            ]
          })
          s2.withTest('oops', {
            status: Status.Skipped,
            output: 'test skipped',
            duration: 123,
          })    
        })

    it('should convert to JUnit object', function() {
        const jObj = run.toJUnitObj()
        expect(jObj.testsuite.length).toBe(2)
        expect(jObj._status).toBe('failed')
        expect(jObj._tests).toBe(3)
        expect(jObj._failures).toBe(1)
        expect(jObj._skipped).toBe(1)
        expect(jObj._time).toBe(369)
        expect(jObj.testsuite[0].testcase.length).toBe(0)
        expect(jObj.testsuite[1].testcase.length).toBe(3)
        expect(jObj.testsuite[1].testcase[0]._name).toBe('yay')
        expect(jObj.testsuite[1].testcase[0]._time).toBe(123)
        expect(jObj.testsuite[1].testcase[1].failure).not.toBe(undefined)
        expect(jObj.testsuite[1].testcase[2].skipped).not.toBe(undefined)
    })
})