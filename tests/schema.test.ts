import myJsonSchema from '../api/schema.json';
import { Status, Suite, TestRun } from '../src';
import { Draft07, Draft, JsonError } from 'json-schema-library';

describe('json report', function () {
  it('validates against schema', function () {
    const suite = new Suite('passed');
    suite.withTest('yay', {
      status: Status.Passed,
      duration: 123,
      startTime: new Date('2021-11-09T00:21:26.836Z'),
    });

    const r = new TestRun();
    r.addSuite(suite);
    r.computeStatus();

    const jsonSchema: Draft = new Draft07(myJsonSchema);
    const errors: JsonError[] = jsonSchema.validate(JSON.parse(r.stringify()));

    expect(errors).toStrictEqual([]);
  });

  it('fails against schema', function () {
    const jsonSchema: Draft = new Draft07(myJsonSchema);
    const errors: JsonError[] = jsonSchema.validate({});

    expect(errors.length).toBeGreaterThan(0);
  });
});
