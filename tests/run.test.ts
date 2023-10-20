import { TestRun, Status, Suite } from '../src';

const FailedSuite = new Suite('failed');
FailedSuite.withTest('uhoh', {
  status: Status.Failed,
  duration: 123,
  startTime: new Date('2021-11-09T00:21:26.836Z'),
});

const PassedSuite = new Suite('passed');
PassedSuite.withTest('yay', {
  status: Status.Passed,
  duration: 123,
  startTime: new Date('2021-11-09T00:21:26.836Z'),
});

const SkippedSuite = new Suite('skipped');
SkippedSuite.withTest('nah', {
  status: Status.Skipped,
  duration: 123,
  startTime: new Date('2021-11-09T00:21:26.836Z'),
});

describe('computeStatus()', function () {
  let r = new TestRun();

  beforeEach(function () {
    r = new TestRun();
  });

  it('should return status of Skipped when no suites exist', function () {
    expect(r.computeStatus()).toBe(Status.Skipped);
  });

  it('should return status of Failed when at least one suite has Failed', function () {
    r.addSuite(PassedSuite);
    r.addSuite(SkippedSuite);
    r.addSuite(FailedSuite);
    expect(r.computeStatus()).toBe(Status.Failed);
  });

  it('should return status of Passed when all suites have Passed', function () {
    r.addSuite(PassedSuite);
    expect(r.computeStatus()).toBe(Status.Passed);
  });

  it('should return status of Skipped when all suites have Skipped', function () {
    r.addSuite(SkippedSuite);
    expect(r.computeStatus()).toBe(Status.Skipped);
  });
});

describe('withSuite()', function () {
  let r = new TestRun();

  beforeEach(function () {
    r = new TestRun();
  });

  it('should add a suite to the run', function () {
    r.withSuite('my sweet suite');
    expect(r.suites.length).toBe(1);
  });

  it('should only add one suite with the same name', function () {
    const s1 = r.withSuite('my sweet suite');
    const s2 = r.withSuite('my sweet suite');
    expect(r.suites.length).toBe(1);
    expect(s1).toBe(s2);
  });
});

describe('stringify()', function () {
  it('renders correctly', function () {
    const r = new TestRun();
    r.addSuite(PassedSuite);
    expect(r.stringify()).toMatchSnapshot();
  });
});
