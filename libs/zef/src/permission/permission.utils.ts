export function createRule(
  rule: { 'only': string[] } | { 'except': string[] },
  redirectTo?: any[]) {
  return {
    rule,
    redirectTo
  };
}
