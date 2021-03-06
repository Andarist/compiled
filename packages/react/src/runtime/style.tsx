import React, { memo } from 'react';
import createStyleSheet, { getStyleBucketName, styleBucketOrdering } from './sheet';
import { analyzeCssInDev } from './dev-warnings';
import { StyleSheetOpts, Bucket } from './types';
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

function Style(props: StyleProps) {
  const inserted = useCache();

  if (process.env.NODE_ENV === 'development') {
    props.children.forEach(analyzeCssInDev);
  }

  if (props.children.length) {
    if (isNodeEnvironment()) {
      const bucketedSheets: Partial<Record<Bucket, string[]>> = {};
      let hasSheets = false;

      for (let i = 0; i < props.children.length; i++) {
        const sheet = props.children[i];
        if (inserted[sheet]) {
          continue;
        } else {
          inserted[sheet] = true;
          hasSheets = true;
        }

        const bucketName = getStyleBucketName(sheet);
        bucketedSheets[bucketName] = bucketedSheets[bucketName] || [];
        bucketedSheets[bucketName]!.push(sheet);
      }

      if (!hasSheets) {
        return null;
      }

      return (
        <style nonce={props.nonce}>
          {styleBucketOrdering.map((bucket) => bucketedSheets[bucket])}
        </style>
      );
    } else {
      if (!stylesheet) {
        stylesheet = createStyleSheet(props);
      }

      for (let i = 0; i < props.children.length; i++) {
        const sheet = props.children[i];
        if (inserted[sheet]) {
          continue;
        }

        inserted[sheet] = true;
        stylesheet(sheet);
      }
    }
  }

  return null;
}

export default memo(Style, () => true);
