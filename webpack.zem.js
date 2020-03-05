// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = function(webpackConfig) {
  return {
    ...webpackConfig,
    target: "web",
    entry: {
      ...webpackConfig.entry,
      main: path.resolve(__dirname, "src/index.ts"),
    },
    module: {
      ...webpackConfig.module,
      rules: [
        ...webpackConfig.module.rules,
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.ejs/,
          use: [{ loader: "ejs-compiled-loader" }],
        },
        {
          test: /\.njk/,
          use: [{ loader: "nunjucks-loader" }],
        },
      ],
    },
    resolve: {
      ...webpackConfig.resolve,
      extensions: [".tsx", ".ts", ".js", ".json", ".njk"],
      alias: {
        ...(webpackConfig.resolve ? webpackConfig.resolve.alias : []),
        templates: path.resolve(__dirname, "src/templates"),
      },
    },
  };
};
