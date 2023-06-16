# sauce-json-reporter-js

A javascript library for creating Sauce Labs JSON test results.

A [JSON schema](api/schema.json) describing the report is also available.

## Examples

```javascript
const {TestRun, Status} = require('@saucelabs/sauce-json-reporter');

let r = new TestRun()
const s1 = r.withSuite('somegroup')
const s2 = s1.withSuite('somefile.test.js')
s2.withTest('yay', {
  status: Status.Passed,
  duration: 123,
})
s2.withTest('nay', {
  status: Status.Failed,
  duration: 123,
})

r.stringify() // returns a JSON string representing the entire test run
// or
r.toFile('myreport.json') // writes the JSON to a file instead
// or
r.toJUnitFile('my_junit_report.xml') // converts and writes the result to JUnit file
```

The resulting JSON of the above example is:

```json
{
  "status": "failed",
  "attachments": [],
  "suites": [
    {
      "name": "somegroup",
      "status": "failed",
      "suites": [
        {
          "name": "somefile.test.js",
          "status": "failed",
          "suites": [],
          "attachments": [],
          "tests": [
            {
              "name": "yay",
              "status": "passed",
              "startTime": "2021-11-09T21:10:59.550Z",
              "duration": 123,
              "attachments": []
            },
            {
              "name": "nay",
              "status": "failed",
              "startTime": "2021-11-09T21:10:59.550Z",
              "duration": 123,
              "attachments": []
            }
          ]
        }
      ],
      "attachments": [],
      "tests": []
    }
  ]
}
```

The resulting JUnit file of the above example is:
```
<testsuites status="failed">
  <testsuites name="somegroup" status="failed">
    <metadata></metadata>
    <testsuites name="somefile.test.js" status="failed">
      <metadata></metadata>
      <testcase name="yay" status="passed" duration="123" startTime="2023-06-16T00:54:01.600Z">
        <metadata></metadata>
      </testcase>
      <testcase name="nay" status="failed" duration="123" startTime="2023-06-16T00:54:01.600Z">
        <metadata></metadata>
      </testcase>
    </testsuites>
  </testsuites>
  <metadata></metadata>
</testsuites>
```