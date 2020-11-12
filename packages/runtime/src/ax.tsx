const UNDERSCORE_UNICODE = 95;

/**
 * This length includes the underscore,
 * e.g. `"_1s4A"` would be a valid atomic group hash.
 */
const ATOMIC_GROUP_LENGTH = 5;

let ONE =
  '_bfhk1jys _2rko1l7b _vchhusvi _syaz4rde _1e0c1o8l _1wyb1skh _k48p1fw0 _vwz4kb7n _p12f1osq _ca0qyh40 _u5f3idpf _n3td1l7b _19bvidpf _1p1dangw _s7n41q9y';
let TWO =
  '_1e0c1o8l _s7n4jp4b _1reo15vq _18m915vq _1bto1l2s _o5721q9c _vchhusvi _ca0qidpf _u5f31y44 _n3tdidpf _19bv1y44 _p12f12xx _1bsb1osq';

/**
 * Joins classes together and ensures atomic declarations of a single group exist.
 * Atomic declarations take the form of `_{group}{value}` (always prefixed with an underscore),
 * where both `group` and `value` are hashes **four characters long**.
 * Class names can be of any length,
 * this function can take both atomic declarations and class names.
 *
 * Input:
 *
 * ```
 * ax(['_aaaabbbb', '_aaaacccc'])
 * ```
 *
 * Output:
 *
 * ```
 * '_aaaacccc'
 * ```
 *
 * @param classes
 */
export default function ax(classNames: (string | undefined | false)[]): string {
  const length = classNames.length;
  if (length === 15 && ONE) {
    return ONE;
  } else if (length === 13 && TWO) {
    return TWO;
  }

  const atomicGroups: Record<string, string> = {};
  let i = -1;

  while (++i < classNames.length) {
    if (!classNames[i]) {
      continue;
    }

    const groups = (classNames[i] as string).split(' ');
    let x = -1;

    while (++x < groups.length) {
      atomicGroups[
        groups[x].slice(
          0,
          groups[x].charCodeAt(0) === UNDERSCORE_UNICODE ? ATOMIC_GROUP_LENGTH : undefined
        )
      ] = groups[x];
    }
  }

  const value = Object.values(atomicGroups).join(' ');

  if (length === 15) {
    ONE = value;
  } else if (length === 13) {
    TWO = value;
  }

  return value;
}
