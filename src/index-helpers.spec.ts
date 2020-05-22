//
// Imports
//

import {
  arrayIncludesAnyItemOf
} from './index-helpers';

//
// Tests
//

describe(arrayIncludesAnyItemOf, () => {
  it('returns false', () => {
    const arr1 = ['a', 'b'];
    const arr2 = ['c'];
    expect(arrayIncludesAnyItemOf(arr1, arr2)).toBe(false);
  });

  it('returns true', () => {
    const arr1 = ['a', 'b'];
    const arr2 = ['a'];
    expect(arrayIncludesAnyItemOf(arr1, arr2)).toBe(true);
  });
});
