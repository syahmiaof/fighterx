/**
 * Test framework interfaces, types, and assertion utilities for FighterX Coach Portal V1.
 */

export type TestTier = 1 | 2 | 3 | 4;

export interface TestCase {
  id: string;
  name: string;
  tier: TestTier;
  category: string;
  run: () => Promise<void> | void;
}

export interface TestResult {
  id: string;
  name: string;
  tier: TestTier;
  category: string;
  status: "PASS" | "FAIL" | "PENDING";
  durationMs: number;
  error?: Error;
}

export class AssertionError extends Error {
  constructor(message: string, public actual?: unknown, public expected?: unknown) {
    super(message);
    this.name = "AssertionError";
  }
}

export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new AssertionError(`Assertion Failed: ${message}`, false, true);
  }
}

export function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new AssertionError(
      message || `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`,
      actual,
      expected
    );
  }
}

export function assertDeepEqual<T>(actual: T, expected: T, message?: string): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new AssertionError(
      message || `Deep equality mismatch.\nExpected: ${expectedStr}\nActual:   ${actualStr}`,
      actual,
      expected
    );
  }
}

export function assertCloseTo(
  actual: number,
  expected: number,
  delta: number,
  message?: string
): void {
  if (Math.abs(actual - expected) > delta) {
    throw new AssertionError(
      message || `Expected ${actual} to be close to ${expected} within +/-${delta}`,
      actual,
      expected
    );
  }
}

export function assertIncludes(haystack: string, needle: string, message?: string): void {
  if (!haystack.includes(needle)) {
    throw new AssertionError(
      message || `Expected string to include '${needle}', but was: ${haystack.slice(0, 200)}...`,
      haystack,
      needle
    );
  }
}

export function assertThrows(fn: () => unknown, expectedSubstr?: string, message?: string): void {
  let threw = false;
  try {
    fn();
  } catch (err) {
    threw = true;
    if (expectedSubstr && err instanceof Error) {
      if (!err.message.includes(expectedSubstr)) {
        throw new AssertionError(
          `Expected thrown error to include '${expectedSubstr}', but got '${err.message}'`,
          err.message,
          expectedSubstr
        );
      }
    }
  }

  if (!threw) {
    throw new AssertionError(message || "Expected function to throw an error, but it did not");
  }
}

// Colors for terminal formatting
export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
};
