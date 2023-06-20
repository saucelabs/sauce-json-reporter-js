import * as fs from "fs"
import { XMLBuilder } from 'fast-xml-parser'

type HasKeyOf<T> = {[P in keyof T]?: T[P]};

export enum Status {
    Passed = "passed",
    Skipped = "skipped",
    Failed = "failed",
}

export interface Stateful {
    status: Status
}

export interface Attachment {
    name: string
    path: string
    contentType: string
}

/**
 * JUnitTestCase represents a single, individual testcase in JUnit format.
 */
export class JUnitTestCase {
    _name: string
    _status: Status
    _time: number
    _timestamp: string
    _videoTimestamp?: number
    properties: object
    failure?: object
    skipped?: object
    code?: TestCode

    constructor(
        name: string,
        status: Status,
        time: number,
        properties: object[],
        timestamp: string,
        videoTimestamp?: number,
        output?: string,
        code?: TestCode,
    ) {
        this._name = name 
        this._status = status
        this._time = time
        this._timestamp = timestamp
        this._videoTimestamp = videoTimestamp
        this.properties = { property: properties }
        this.code = code
        if (status === Status.Failed) {
            this.failure = { output }
        }
        if (status === Status.Skipped) {
            this.skipped = { output }
        }
    }
}

/**
 * JUnitTestSuite represents a testsuite in JUnit format.
 */
export class JUnitTestSuite {
    _name: string
    _status: Status
    _tests: number
    _failures: number
    _skipped: number
    _time: number
    properties: object
    testcase: JUnitTestCase[] // to correctly build an array using XMLBuilder, testcase should be kept in the singular form.

    constructor(
        name: string,
        status: Status,    
        properties: object[],
        testcases: JUnitTestCase[],
    ) {
        this._name = name
        this._status = status
        this.properties = { property: properties }
        this.testcase = testcases
        this._tests = testcases.length
        this._failures = 0
        this._skipped = 0
        this._time = 0
        this.testcase.forEach(testcase => {
            if (testcase._status === Status.Failed) {
                this._failures += 1
            }
            if (testcase._status === Status.Skipped) {
                this._skipped += 1
            }
            this._time += testcase._time
        })
    }
}

/**
 * JUnitReport represents a JUnit report.
 */
export class JUnitReport {
    _status: Status
    _tests: number
    _failures: number
    _skipped: number
    _time: number
    testsuite: JUnitTestSuite[] // to correctly build an array using XMLBuilder, testsuite should be kept in the singular form.
    properties: object

    constructor(
        testsuites: JUnitTestSuite[],
        status: Status,
        properties: object[],
    ) {
        this.testsuite = testsuites
        this._status = status
        this.properties = { property: properties }
        this._failures = 0
        this._skipped = 0
        this._tests = 0
        this._time = 0
        this.testsuite.forEach(testsuite => {
            this._failures += testsuite._failures
            this._skipped += testsuite._skipped
            this._tests += testsuite._tests
            this._time += testsuite._time
        })
    }
}

/**
 * toProperty converts attachments and metadata to JUnit properties.
 */
function toProperty(
    attachments: Attachment[],
    metadata: object,
) {
    const properties: object[] = [];
    attachments.forEach(attachment => {
        properties.push({
            _name: 'attachment',
            _value: attachment.name,
            '#text': attachment.path,
        })
    })
    Object.entries(metadata).forEach(([key, value]) => {
        properties.push({
            _name: key,
            _value: value,
        })
    });
   return properties
}

/**
 * TestRun represents the entire test run.
 */
export class TestRun {
    status: Status
    attachments: Attachment[]
    suites: Suite[]
    metadata: object

    constructor() {
        this.status = Status.Skipped
        this.attachments = new Array<Attachment>()
        this.suites = new Array<Suite>()
        this.metadata = {}
    }

    attach(attachment: Attachment) {
        this.attachments.push(attachment)
    }

    addSuite(suite: Suite) {
        this.suites.push(suite)
    }

    computeStatus(): Status {
        this.suites.forEach(suite => {
            suite.computeStatus()
            this.status = statusOf(this, suite)
        })

        return this.status
    }

    withSuite(name: string): Suite {
        let suite = this.suites.find(suite => suite.name === name)

        if (!suite) {
            suite = new Suite(name)
            this.addSuite(suite)
        }

        return suite
    }

    stringify(computeStatus = true): string {
        if (computeStatus) {
            this.computeStatus()
        }
        return JSON.stringify(this, null, 2)
    }

    toJUnitObj(computeStatus = true): JUnitReport {
        if (computeStatus) {
            this.computeStatus()
        }

        const testsuites: JUnitTestSuite[] = [];
        this.suites.forEach(suite => {
            testsuites.push(...suite.toJUnitObj())
        })

        return new JUnitReport(
            testsuites,
            this.status,
            toProperty(this.attachments, this.metadata),
        )
    }

    toJUnitFile(filepath: string) {
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "_",
            format: true,
            suppressEmptyNode: true,
            cdataPropName: "output",
        }
        const builder = new XMLBuilder(options)
        const xml = builder.build({ testsuites: this.toJUnitObj() })
        fs.writeFileSync(filepath, xml) 
    } 

    toFile(filepath: string, computeStatus = true) {
        if (computeStatus) {
            this.computeStatus()
        }
        fs.writeFileSync(filepath, this.stringify())
    }
}

/**
 * Suite represents a group of tests. It may be nested as part of another suite.
 */
export class Suite {
    name: string
    status: Status
    metadata: object
    suites: Suite[]
    attachments: Attachment[]
    tests: Test[]

    constructor(name: string) {
        this.name = name
        this.status = Status.Skipped
        this.metadata = {}
        this.suites = new Array<Suite>()
        this.attachments = new Array<Attachment>()
        this.tests = new Array<Test>()
    }

    attach(attachment: Attachment) {
        this.attachments.push(attachment)
    }

    addSuite(suite: Suite) {
        this.suites.push(suite)
    }

    addTest(test: Test) {
        this.tests.push(test)
    }

    computeStatus(): Status {
        this.suites.forEach(suite => {
            suite.computeStatus()
            this.status = statusOf(this, suite)
        })

        this.tests.forEach(test => {
            this.status = statusOf(this, test)
        })
        return this.status
    }

    withSuite(name: string): Suite {
        let suite = this.suites.find(suite => suite.name === name)

        if (!suite) {
            suite = new Suite(name)
            this.addSuite(suite)
        }

        return suite
    }

    withTest(
        name: string,
        options: HasKeyOf<Test> = {},
    ): Test {
        const test = new Test(name, options.status, options.duration, options.output, options.startTime, options.attachments, options.metadata, options.code, options.videoTimestamp)
        this.addTest(test)
        return test
    }

    toJUnitObj(): JUnitTestSuite[] {
        const testcases: JUnitTestCase[] = []
        this.tests.forEach(test => {
            testcases.push(test.toJUnitObj())
        })

        const suites: JUnitTestSuite[] = [
            new JUnitTestSuite(
                this.name,
                this.status,
                toProperty(this.attachments, this.metadata),
                testcases,
            )
        ]
        this.suites.forEach(suite => {
            suites.push(...suite.toJUnitObj())
        })

        return suites
    }
}

/**
 * Test represents a single, individual test.
 */
export class Test {
    name: string
    status: Status
    duration: number
    output?: string
    startTime: Date
    attachments?: Attachment[]
    metadata: object
    code?: TestCode
    videoTimestamp?: number

    constructor(
        name: string,
        status: Status = Status.Skipped,
        duration = 0,
        output?: string,
        startTime: Date = new Date(),
        attachments: Attachment[] = new Array<Attachment>(),
        metadata: object = {},
        code?: TestCode,
        videoTimestamp?: number
    ) {
        this.name = name
        this.status = status
        this.startTime = startTime
        this.duration = duration
        this.metadata = metadata
        this.output = output
        this.attachments = attachments
        this.code = code
        this.videoTimestamp = videoTimestamp
    }

    attach(attachment: Attachment) {
        this.attachments?.push(attachment)
    }

    toJUnitObj(): JUnitTestCase {
        return new JUnitTestCase(
            this.name,
            this.status,
            this.duration,
            toProperty(this.attachments || [], this.metadata),
            // startTime should be a string in this case. Otherwise, XMLBuilder will not recognize the attribute name prefix.
            this.startTime.toISOString(),
            this.videoTimestamp,
            this.output,
            this.code
        )
    }
}

/**
 * TestCode represents the code associated to a test.
 */
export class TestCode {
    lines: string[]

    constructor(lines: string[]) {
        this.lines = lines
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
        return child.status
    } else if (child.status === Status.Failed) {
        return Status.Failed
    }

    return parent.status
}
