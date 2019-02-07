const colorsTemplate = require('template/colors.njk');

describe('colors.njk', () => {

  test('single color without transparency gets rendered', () => {
    let renderedTemplate;
    try {
      renderedTemplate = colorsTemplate.render({
        colors: [
          { name: 'test-color', r: 255, g: 255, b: 255, a: 1 },
        ],
      });
    } catch (error) {
      console.error(error);
    }
    expect(renderedTemplate).toEqual('$test-color: rgb(255, 255, 255);\n')
  });

  test('multiple colors without transparency get rendered', () => {
    let renderedTemplate;
    try {
      renderedTemplate = colorsTemplate.render({
        colors: [
          { name: 'test-color', r: 255, g: 255, b: 255, a: 1 },
          { name: 'test-color-two', r: 255, g: 255, b: 255, a: 1 },
        ],
      });
    } catch (error) {
      console.error(error);
    }
    expect(renderedTemplate).toMatchSnapshot();
    expect(renderedTemplate).toEqual(
      '$test-color: rgb(255, 255, 255);\n' +
      '$test-color-two: rgb(255, 255, 255);\n'
    );
  });

});
