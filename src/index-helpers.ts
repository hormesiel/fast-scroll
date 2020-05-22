/**
 * @returns `true` if `arr1` contains at least one item from `arr2`, otherwise returns `false`.
 */
export function arrayIncludesAnyItemOf(arr1: Array<any>, arr2: Array<any>): boolean {
  for (const item2 of arr2) {
    if (arr1.includes(item2))
      return true;
  }

  return false;
}
