import { Status, Suite, Test } from '../src';

const FailedTest = new Test('failed', Status.Failed);
const PassedTest = new Test('passed', Status.Passed);
const SkippedTest = new Test('skipped', Status.Skipped);

describe('computeStatus()', function () {
  let s: Suite;

  beforeEach(function () {
    s = new Suite('testing compute');
  });

  it('should return status of Skipped when no tests exist', function () {
    expect(s.computeStatus()).toBe(Status.Skipped);
  });

  it('should return status of Failed when at least one test has Failed', function () {
    s.addTest(FailedTest);
    s.addTest(SkippedTest);
    s.addTest(PassedTest);
    expect(s.computeStatus()).toBe(Status.Failed);
  });

  it('should return status of Passed when all tests have Passed', function () {
    s.addTest(PassedTest);
    expect(s.computeStatus()).toBe(Status.Passed);
  });

  it('should return status of Skipped when all suites have Skipped', function () {
    s.addTest(SkippedTest);
    expect(s.computeStatus()).toBe(Status.Skipped);
  });
});

describe('withSuite()', function () {
  let s: Suite;

  beforeEach(function () {
    s = new Suite('root');
  });

  it('should add a sub-suite', function () {
    s.withSuite('my sweet suite');
    expect(s.suites.length).toBe(1);
  });

  it('should only add one sub-suite with the same name', function () {
    const s1 = s.withSuite('my sweet suite');
    const s2 = s.withSuite('my sweet suite');
    expect(s.suites.length).toBe(1);
    expect(s1).toBe(s2);
  });
});
