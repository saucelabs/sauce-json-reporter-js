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
s2.withTest('oops', {
  status: Status.Skipped,
  output: 'test skipped',
  duration: 123,
})

r.metadata = {
  'id': '123'
}

r.stringify() // returns a JSON string representing the entire test run
// or
r.toFile('my_json_report.json') // writes the JSON to a file instead
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
              "startTime": "2023-06-19T18:26:06.227Z",
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
              "startTime": "2023-06-19T18:26:06.227Z",
              "attachments": [
                {
                  "name": "video.mp4",
                  "path": "./video.mp4"
                }
              ],
              "metadata": {}
            },
            {
              "name": "oops",
              "status": "skipped",
              "duration": 123,
              "output": "test skipped",
              "startTime": "2023-06-19T18:26:06.227Z",
              "attachments": [],
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
  "metadata": {
    "id": "123"
  }
}
```
