import * as fs from 'fs';

type HasKeyOf<T> = { [P in keyof T]?: T[P] };

export enum Status {
  Passed = 'passed',
  Skipped = 'skipped',
  Failed = 'failed',
}

export interface Stateful {
  status: Status;
}

export interface Attachment {
  name: string;
  path: string;
  contentType: string;
}

/**
 * TestRun represents the entire test run.
 */
export class TestRun {
  status: Status;
  attachments: Attachment[];
  suites: Suite[];
  metadata: object;

  constructor() {
    this.status = Status.Skipped;
    this.attachments = new Array<Attachment>();
    this.suites = new Array<Suite>();
    this.metadata = {};
  }

  attach(attachment: Attachment) {
    this.attachments.push(attachment);
  }

  addSuite(suite: Suite) {
    this.suites.push(suite);
  }

  computeStatus(): Status {
    this.suites.forEach((suite) => {
      suite.computeStatus();
      this.status = statusOf(this, suite);
    });

    return this.status;
  }

  withSuite(name: string): Suite {
    let suite = this.suites.find((suite) => suite.name === name);

    if (!suite) {
      suite = new Suite(name);
      this.addSuite(suite);
    }

    return suite;
  }

  stringify(computeStatus = true): string {
    if (computeStatus) {
      this.computeStatus();
    }
    return JSON.stringify(this, null, 2);
  }

  toFile(filepath: string, computeStatus = true) {
    if (computeStatus) {
      this.computeStatus();
    }
    fs.writeFileSync(filepath, this.stringify());
  }
}

/**
 * Suite represents a group of tests. It may be nested as part of another suite.
 */
export class Suite {
  name: string;
  status: Status;
  metadata: object;
  suites: Suite[];
  attachments: Attachment[];
  tests: Test[];

  constructor(name: string) {
    this.name = name;
    this.status = Status.Skipped;
    this.metadata = {};
    this.suites = new Array<Suite>();
    this.attachments = new Array<Attachment>();
    this.tests = new Array<Test>();
  }

  attach(attachment: Attachment) {
    this.attachments.push(attachment);
  }

  addSuite(suite: Suite) {
    this.suites.push(suite);
  }

  addTest(test: Test) {
    this.tests.push(test);
  }

  computeStatus(): Status {
    this.suites.forEach((suite) => {
      suite.computeStatus();
      this.status = statusOf(this, suite);
    });

    this.tests.forEach((test) => {
      this.status = statusOf(this, test);
    });
    return this.status;
  }

  withSuite(name: string): Suite {
    let suite = this.suites.find((suite) => suite.name === name);

    if (!suite) {
      suite = new Suite(name);
      this.addSuite(suite);
    }

    return suite;
  }

  withTest(name: string, options: HasKeyOf<Test> = {}): Test {
    const test = new Test(
      name,
      options.status,
      options.duration,
      options.output,
      options.startTime,
      options.attachments,
      options.metadata,
      options.code,
      options.videoTimestamp,
    );
    this.addTest(test);
    return test;
  }
}

/**
 * Test represents a single, individual test.
 */
export class Test {
  name: string;
  status: Status;
  duration: number;
  output?: string;
  startTime: Date;
  attachments?: Attachment[];
  metadata: object;
  code?: TestCode;
  videoTimestamp?: number;

  constructor(
    name: string,
    status: Status = Status.Skipped,
    duration = 0,
    output?: string,
    startTime: Date = new Date(),
    attachments: Attachment[] = new Array<Attachment>(),
    metadata: object = {},
    code?: TestCode,
    videoTimestamp?: number,
  ) {
    this.name = name;
    this.status = status;
    this.startTime = startTime;
    this.duration = duration;
    this.metadata = metadata;
    this.output = output;
    this.attachments = attachments;
    this.code = code;
    this.videoTimestamp = videoTimestamp;
  }

  attach(attachment: Attachment) {
    this.attachments?.push(attachment);
  }
}

/**
 * TestCode represents the code associated to a test.
 */
export class TestCode {
  lines: string[];

  constructor(lines: string[]) {
    this.lines = lines;
  }
}

/**
 * Determines the final status of the parent based on the child's status.
 *
 * Possible status transitions:
 *   - skipped -> passed/failed/skipped
 *   - passed -> failed
 *   - failed -> failed
 *
 * @param parent the parent to update
 * @param child the child to update the parent with
 */
export function statusOf(parent: Stateful, child: Stateful): Status {
  if (parent.status === Status.Skipped) {
    return child.status;
  } else if (child.status === Status.Failed) {
    return Status.Failed;
  }

  return parent.status;
}
