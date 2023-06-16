# sauce-json-reporter-js

A javascript library for creating Sauce Labs JSON test results.

A [JSON schema](api/schema.json) describing the report is also available.

## Examples

```javascript
const {TestRun, Status} = require('@saucelabs/sauce-json-reporter');

let r = new TestRun()
r.attach('screenshot.png')
const s1 = r.withSuite('somegroup')
const s2 = s1.withSuite('somefile.test.js')
s1.attach('screenshot1.png')
s2.withTest('yay', {
  status: Status.Passed,
  duration: 123,
  attachments: ['video.mp4'],
})
s2.withTest('nay', {
  status: Status.Failed,
  output: 'test failed',
  duration: 123,
  attachments: ['video.mp4'],
})

r.stringify() // returns a JSON string representing the entire test run
// or
r.toFile('my_json_report.json') // writes the JSON to a file instead
// or
r.toJUnitFile('my_junit_report.xml') // converts and writes the result to a JUnit file
```

The resulting JSON of the above example is:

```json
{
  "status": "failed",
  "attachments": [
    "screenshot.png"
  ],
  "suites": [
    {
      "name": "somegroup",
      "status": "failed",
      "metadata": {},
      "suites": [
        {
          "name": "somefile.test.js",
          "status": "failed",
          "metadata": {},
          "suites": [],
          "attachments": [],
          "tests": [
            {
              "name": "yay",
              "status": "passed",
              "duration": 123,
              "startTime": "2023-06-16T17:42:39.568Z",
              "attachments": [
                "video.mp4"
              ],
              "metadata": {}
            },
            {
              "name": "nay",
              "status": "failed",
              "duration": 123,
              "output": "test failed",
              "startTime": "2023-06-16T17:42:39.568Z",
              "attachments": [
                "video.mp4"
              ],
              "metadata": {}
            }
          ]
        }
      ],
      "attachments": [
        "screenshot1.png"
      ],
      "tests": []
    }
  ],
  "metadata": {}
}
```

The resulting JUnit file of the above example is:
```
<testsuites status="failed">
  <testsuite name="somegroup" status="failed">
    <attachment>screenshot1.png</attachment>
    <properties></properties>
  </testsuite>
  <testsuite name="somefile.test.js" status="failed">
    <properties></properties>
    <testcase name="yay" status="passed" duration="123" startTime="2023-06-16T20:17:04.759Z">
      <attachment>video.mp4</attachment>
      <attachment>screenshot2.png</attachment>
      <properties></properties>
    </testcase>
    <testcase name="nay" status="failed" duration="123" startTime="2023-06-16T20:17:04.759Z">
      <failure>test failed</failure>
      <attachment>video.mp4</attachment>
      <properties></properties>
    </testcase>
  </testsuite>
  <attachment>screenshot.png</attachment>
  <properties></properties>
</testsuites>
```