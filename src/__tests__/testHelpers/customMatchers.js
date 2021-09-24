// eslint-disable-next-line @typescript-eslint/no-var-requires
const toEqualMultiline = require("jest-multiline-matchers").default;
expect.extend({
  toEqualMultiline,
});
