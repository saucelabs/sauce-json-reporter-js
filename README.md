# sauce-json-reporter-js

A javascript library for creating Sauce Labs JSON test results.

A [JSON schema](api/schema.json) describing the report is also available.

## Examples

```javascript
const {TestRun, Status} = require('@saucelabs/sauce-json-reporter');

let r = new TestRun()
r.attach({name: 'screenshot.png', path:'./screenshot.png'})
const s1 = r.withSuite('somegroup')
const s2 = s1.withSuite('somefile.test.js')
s1.attach({name: 'screenshot1.png', path: './screenshot1.png'})
s2.withTest('yay', {
  status: Status.Passed,
  duration: 123,
  attachments: [
    {name: 'video.mp4', path: './video.mp4'},
    {name: 'screenshot2.png', path: './screenshot2.png'}
  ],
})
s2.withTest('nay', {
  status: Status.Failed,
  output: 'test failed',
  duration: 123,
  attachments: [
    {name: 'video.mp4', path: './video.mp4'},
  ]
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
    {
      "name": "screenshot.png",
      "path": "./screenshot.png"
    }
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
              "startTime": "2023-06-16T22:16:10.595Z",
              "attachments": [
                {
                  "name": "video.mp4",
                  "path": "./video.mp4"
                },
                {
                  "name": "screenshot2.png",
                  "path": "./screenshot2.png"
                }
              ],
              "metadata": {}
            },
            {
              "name": "nay",
              "status": "failed",
              "duration": 123,
              "output": "test failed",
              "startTime": "2023-06-16T22:16:10.595Z",
              "attachments": [
                {
                  "name": "video.mp4",
                  "path": "./video.mp4"
                }
              ],
              "metadata": {}
            }
          ]
        }
      ],
      "attachments": [
        {
          "name": "screenshot1.png",
          "path": "./screenshot1.png"
        }
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
    <properties>
      <property name="attachment" value="screenshot1.png">./screenshot1.png</property>
    </properties>
  </testsuite>
  <testsuite name="somefile.test.js" status="failed">
    <properties/>
    <testcase name="yay" status="passed" duration="123" timestamp="2023-06-19T16:39:39.791Z">
      <properties>
        <property name="attachment" value="video.mp4">./video.mp4</property>
        <property name="attachment" value="screenshot2.png">./screenshot2.png</property>
      </properties>
    </testcase>
    <testcase name="nay" status="failed" duration="123" timestamp="2023-06-19T16:39:39.791Z">
      <properties>
        <property name="attachment" value="video.mp4">./video.mp4</property>
      </properties>
      <failure>test failed</failure>
    </testcase>
  </testsuite>
  <properties>
    <property name="attachment" value="screenshot.png">./screenshot.png</property>
    <property name="ids" value="{&quot;test&quot;:1,&quot;test2&quot;:2}"/>
    <property name="attached" value="false"/>
    <property name="count" value="3"/>
  </properties>
</testsuites>
```