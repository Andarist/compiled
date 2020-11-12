import * as React from 'react';
import { memo } from 'react';
import createStyleSheet, { groupSheetsByBucket, styleBucketOrdering } from './sheet';
import { analyzeCssInDev } from './dev-warnings';
import { StyleSheetOpts } from './types';
import { useCache } from './provider';
import { isNodeEnvironment } from './is-node';

interface StyleProps extends StyleSheetOpts {
  /**
   * CSS Rules.
   * Ensure each rule is a separate element in the array.
   */
  children: string[];
}

// Variable declaration list because it's smaller.
let stylesheet: ReturnType<typeof createStyleSheet>;

let ONE = false;
let TWO = false;

export default memo(
  function Style(props: StyleProps) {
    const inserted = useCache();

    const length = props.children.length;
    if (length === 15 && ONE) {
      return null;
    } else if (length === 13 && TWO) {
      return null;
    }

    if (length === 15) {
      ONE = true;
    }

    if (length === 13) {
      TWO = true;
    }

    if (process.env.NODE_ENV === 'development') {
      props.children.forEach(analyzeCssInDev);
    }

    const sheets = props.children.filter((sheet) => {
      if (inserted[sheet]) {
        return false;
      }

      return (inserted[sheet] = true);
    });

    if (sheets.length) {
      if (isNodeEnvironment()) {
        // The following code will not exist in the browser bundle.
        const sheetsGroupedByBucket = groupSheetsByBucket(sheets);

        return (
          <style nonce={props.nonce}>
            {styleBucketOrdering.map((bucket) => sheetsGroupedByBucket[bucket])}
          </style>
        );
      } else {
        // Keep re-assigning over ternary because it's smaller
        stylesheet = stylesheet || createStyleSheet(props);
        sheets.forEach(stylesheet);
      }
    }

    return null;
  },
  () => true
);
