import * as micromatch from 'micromatch';

export function urlMatchesAnyGlobOf(url: string, patterns: Array<String>): boolean {
  return micromatch.contains(url, patterns);
}
