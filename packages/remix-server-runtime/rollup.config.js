/* eslint-disable no-restricted-globals, import/no-nodejs-modules */
const path = require("path");
const babel = require("@rollup/plugin-babel").default;
const nodeResolve = require("@rollup/plugin-node-resolve").default;
const copy = require("rollup-plugin-copy");

const {
  getOutputDir,
  isBareModuleId,
  createBanner,
  copyToPlaygrounds,
  magicExportsPlugin,
} = require("../../rollup.utils");
const { name: packageName, version } = require("./package.json");

// Re-export everything from this package that is available in `remix`
/** @type {import('../../rollup.utils').MagicExports} */
const magicExports = {
  "@remix-run/server-runtime": {
    values: ["createSession", "isCookie", "isSession", "json", "redirect"],
    types: [
      "ActionFunction",
      "AppData",
      "AppLoadContext",
      "Cookie",
      "CookieOptions",
      "CookieParseOptions",
      "CookieSerializeOptions",
      "CookieSignatureOptions",
      "EntryContext",
      "ErrorBoundaryComponent",
      "HandleDataRequestFunction",
      "HandleDocumentRequestFunction",
      "HeadersFunction",
      "HtmlLinkDescriptor",
      "HtmlMetaDescriptor",
      "LinkDescriptor",
      "LinksFunction",
      "LoaderFunction",
      "MetaDescriptor",
      "MetaFunction",
      "PageLinkDescriptor",
      "RequestHandler",
      "RouteComponent",
      "RouteHandle",
      "ServerBuild",
      "ServerEntryModule",
      "Session",
      "SessionData",
      "SessionIdStorageStrategy",
      "SessionStorage",
    ],
  },
};

/** @returns {import("rollup").RollupOptions[]} */
module.exports = function rollup() {
  let sourceDir = "packages/remix-server-runtime";
  let outputDir = getOutputDir(packageName);
  let outputDist = path.join(outputDir, "dist");

  return [
    {
      external(id) {
        return isBareModuleId(id);
      },
      input: `${sourceDir}/index.ts`,
      output: {
        banner: createBanner(packageName, version),
        dir: outputDist,
        format: "cjs",
        preserveModules: true,
        exports: "named",
      },
      plugins: [
        babel({
          babelHelpers: "bundled",
          exclude: /node_modules/,
          extensions: [".ts", ".tsx"],
        }),
        nodeResolve({ extensions: [".ts", ".tsx"] }),
        copy({
          targets: [
            { src: "LICENSE.md", dest: [outputDir, sourceDir] },
            { src: `${sourceDir}/package.json`, dest: outputDir },
            { src: `${sourceDir}/README.md`, dest: outputDir },
          ],
        }),
        magicExportsPlugin(magicExports, {
          packageName,
          version,
        }),
        copyToPlaygrounds(),
      ],
    },
    {
      external(id) {
        return isBareModuleId(id);
      },
      input: `${sourceDir}/index.ts`,
      output: {
        banner: createBanner(packageName, version),
        dir: `${outputDist}/esm`,
        format: "esm",
        preserveModules: true,
      },
      plugins: [
        babel({
          babelHelpers: "bundled",
          exclude: /node_modules/,
          extensions: [".ts", ".tsx"],
        }),
        nodeResolve({ extensions: [".ts", ".tsx"] }),
        copyToPlaygrounds(),
      ],
    },
  ];
};
