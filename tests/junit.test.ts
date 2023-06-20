import {TestRun, Status} from '../src'

describe('toJUnitObj', function () {
    const run = new TestRun();

    beforeEach(function() {
        const s1 = run.withSuite('somegroup')
        s1.metadata = {
            id: 1234
        }
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
        s2.metadata = {
            items: {
              test1: 1,
              test2: 2,
            },
            ids: [1, 2, 3]
        }
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
        expect((jObj.testsuite[0].properties as any).property[0]._name).toBe('id')
        expect((jObj.testsuite[0].properties as any).property[0]._value).toBe(1234)
        expect(jObj.testsuite[1].testcase.length).toBe(3)
        expect((jObj.testsuite[1].properties as any).property[0]._name).toBe('items')
        expect((jObj.testsuite[1].properties as any).property[0]._value).toStrictEqual({"test1": 1, "test2": 2})
        expect((jObj.testsuite[1].properties as any).property[1]._name).toBe('ids')
        expect((jObj.testsuite[1].properties as any).property[1]._value).toStrictEqual([1, 2, 3])
        expect(jObj.testsuite[1].testcase[0]._name).toBe('yay')
        expect(jObj.testsuite[1].testcase[0]._time).toBe(123)
        expect(jObj.testsuite[1].testcase[1].failure).not.toBe(undefined)
        expect(jObj.testsuite[1].testcase[2].skipped).not.toBe(undefined)
    })
})