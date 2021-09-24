// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
module.exports = {
  /**
   *
   * @param {Object} src
   * @param {string} _pathToFile
   * @param {Object} transformOptions
   * @param {Object} transformOptions.config
   * @param {string} transformOptions.config.rootDir
   * @param {Object} transformOptions.config.globals
   * @param {Object} transformOptions.config.globals.nunjucks
   * @param {Object} transformOptions.config.globals.nunjucks.config
   * @param {string} transformOptions.config.globals.nunjucks.root
   * @returns {string}
   */
  process(src, _pathToFile, transformOptions) {
    const nunjucksConfig =
      (transformOptions.config.globals.nunjucks && transformOptions.config.globals.nunjucks.config) || {};
    const root = transformOptions.config.globals.nunjucks.root
      ? path.resolve(transformOptions.config.rootDir, transformOptions.config.globals.nunjucks.root)
      : transformOptions.config.rootDir;
    return `
            const njk = require('nunjucks');
            const env = new njk.Environment(new njk.FileSystemLoader(\`${root}\`), JSON.parse(\`${JSON.stringify(
      nunjucksConfig,
    )}\`));
            module.exports = njk.compile(\`${src}\`, env);
        `;
  },
};
