import { Violation } from '@/validator/violation';

export function flattenViolations(violations: Violation[]): Record<string, string[]> {
  const groupedViolations = Object.groupBy(violations, violation => formatPath(violation.path)) as Record<
    string,
    Violation[]
  >;

  const violationEntries: Iterable<readonly [PropertyKey, string[]]> = Object.entries(groupedViolations).map(
    ([field, violations]) => [field, violations.map(v => v.message)],
  );

  return Object.fromEntries(violationEntries);
}

function formatPath(path: string): string {
  return path.replaceAll('[', '.').replaceAll(']', '');
}
