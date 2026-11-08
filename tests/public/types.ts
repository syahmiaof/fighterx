/**
 * FighterX Public E2E Test Suite — Core Types & Assertion Utilities
 * 
 * Provides robust assertion primitives, ANSI color formatters,
 * and test runner execution contracts.
 */

export type TestStatus = "PASS" | "FAIL" | "PENDING";

export interface TestCase {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  description?: string;
  run: () => void | Promise<void>;
}

export interface TestResult {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  status: TestStatus;
  durationMs: number;
  error?: string;
}

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

// ANSI color helpers
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

export function green(text: string): string {
  return `${colors.green}${text}${colors.reset}`;
}

export function red(text: string): string {
  return `${colors.red}${text}${colors.reset}`;
}

export function yellow(text: string): string {
  return `${colors.yellow}${text}${colors.reset}`;
}

export function cyan(text: string): string {
  return `${colors.cyan}${text}${colors.reset}`;
}

export function dim(text: string): string {
  return `${colors.dim}${text}${colors.reset}`;
}

export function bold(text: string): string {
  return `${colors.bold}${text}${colors.reset}`;
}

// Assertion Primitives
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message || "Assertion failed: expected condition to be truthy");
  }
}

export function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new AssertionError(
      message || `Expected ${JSON.stringify(expected)}, but received ${JSON.stringify(actual)}`
    );
  }
}

export function assertNotEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual === expected) {
    throw new AssertionError(
      message || `Expected actual to not equal ${JSON.stringify(expected)}`
    );
  }
}

export function assertDeepEqual<T>(actual: T, expected: T, message?: string): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new AssertionError(
      message || `Deep equality assertion failed:\nExpected: ${expectedStr}\nActual:   ${actualStr}`
    );
  }
}

export function assertCloseTo(actual: number, expected: number, delta = 0.01, message?: string): void {
  if (Math.abs(actual - expected) > delta) {
    throw new AssertionError(
      message || `Expected ${actual} to be close to ${expected} (within +/- ${delta})`
    );
  }
}

export function assertIncludes(haystack: string | unknown[], needle: unknown, message?: string): void {
  if (typeof haystack === "string") {
    if (!haystack.includes(String(needle))) {
      throw new AssertionError(
        message || `Expected string to include "${String(needle)}", but was:\n${haystack.slice(0, 300)}...`
      );
    }
  } else if (Array.isArray(haystack)) {
    if (!haystack.includes(needle)) {
      throw new AssertionError(
        message || `Expected array to include element ${JSON.stringify(needle)}`
      );
    }
  } else {
    throw new AssertionError(message || `Invalid haystack passed to assertIncludes`);
  }
}

export function assertMatches(actual: string, regex: RegExp, message?: string): void {
  if (!regex.test(actual)) {
    throw new AssertionError(
      message || `Expected "${actual}" to match regex ${regex.toString()}`
    );
  }
}

export function assertThrows(fn: () => unknown, message?: string): void {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) {
    throw new AssertionError(message || "Expected function to throw an error, but it returned normally");
  }
}
