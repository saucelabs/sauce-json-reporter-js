# sauce-json-reporter-js
A javascript library for creating Sauce Labs JSON test results.

## Examples

```javascript
const { TestRun, Status } = require('@saucelabs/sauce-json-reporter');

let r = new TestRun()
const s1 = r.withSuite('somegroup')
const s2 = s1.withSuite('somefile.test.js')
s2.withTest('yay', Status.Passed, 123)
s2.withTest('nay', Status.Failed, 123)

r.stringify() // returns a JSON string representing the entire test run
// or
r.toFile('myreport.json') // writes the JSON to a file instead
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
