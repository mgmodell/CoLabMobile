/**
 * Custom Jest resolver that:
 *  1. Strips `exports` from react-native (backwards-compat, same as
 *     @react-native/jest-preset resolver).
 *  2. Also strips `exports` from packages that only declare an `import`
 *     condition (ESM-only), so Jest can fall back to their root `index.js`
 *     in CJS mode.
 *
 * @format
 */

'use strict';

module.exports = (modulePath, options) => {
  const originalPackageFilter = options.packageFilter;

  return options.defaultResolver(modulePath, {
    ...options,
    packageFilter: pkg => {
      const filtered = originalPackageFilter ? originalPackageFilter(pkg) : {...pkg};

      // react-native exports compat (from @react-native/jest-preset)
      if (filtered.name === 'react-native') {
        delete filtered.exports;
      }

      // Strip exports that only have an `import` condition (no CJS entry).
      // Jest runs in CJS mode and can't use `import`-only exports.
      // When exports is stripped the resolver falls back to `index.js`.
      if (filtered.exports) {
        const rootExport = filtered.exports['.'] ?? filtered.exports;
        const hasCjs =
          typeof rootExport === 'string' ||
          rootExport?.require != null ||
          rootExport?.default != null;
        if (!hasCjs) {
          delete filtered.exports;
        }
      }

      return filtered;
    },
  });
};
