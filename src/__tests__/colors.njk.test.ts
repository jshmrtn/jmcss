// eslint-disable-next-line @typescript-eslint/no-var-requires
const colorsTemplate = require("template/colors.njk");

type testColor = Omit<Color, "equals" | "toHex" | "toHsl" | "blend">;

describe("colors.njk", () => {
  test("single color without transparency gets rendered", () => {
    let renderedTemplate;
    try {
      const colors: testColor[] = [{ name: "test-color", r: 255, g: 255, b: 255, a: 1 }];
      renderedTemplate = colorsTemplate.render({
        colors,
      });
    } catch (error) {
      console.error(error);
    }
    expect(renderedTemplate).toMatchSnapshot();
    expect(renderedTemplate).toEqual("$test-color: rgb(255, 255, 255);\n");
  });

  test("multiple colors without transparency get rendered", () => {
    let renderedTemplate;
    try {
      const colors: testColor[] = [
        { name: "test-color", r: 255, g: 255, b: 255, a: 1 },
        { name: "test-color-two", r: 255, g: 255, b: 255, a: 1 },
      ];
      renderedTemplate = colorsTemplate.render({
        colors,
      });
    } catch (error) {
      console.error(error);
    }
    expect(renderedTemplate).toMatchSnapshot();
    expect(renderedTemplate).toEqual("$test-color: rgb(255, 255, 255);\n" + "$test-color-two: rgb(255, 255, 255);\n");
  });

  test("message gets rendered if no colors are present", () => {
    let renderedTemplate;
    try {
      const colors: testColor[] = [];
      renderedTemplate = colorsTemplate.render({
        colors,
      });
    } catch (error) {
      console.error(error);
    }
    expect(renderedTemplate).toMatchSnapshot();
    expect(renderedTemplate).toEqual("/* No colors defined */");
  });
});
