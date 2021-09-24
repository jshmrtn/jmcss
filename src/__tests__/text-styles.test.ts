import { normalizeTextStyles } from "../normalize";
import { getTextStylesFromContext } from "../helpers/context";

jest.mock("../config", () => ({
  __esModule: true,
  getSplitSymbol: jest.fn(() => "/"),
  getDefaultColor: jest.fn(() => "black"),
  getDefaultFontWeight: jest.fn(() => "normal"),
  getDefaultFontStyle: jest.fn(() => "normal"),
  getDefaultTextTransform: jest.fn(() => "none"),
  getDefaultTextAlign: jest.fn(() => "left"),
  includeDefaultValue: jest.fn(() => true),
  getStandardSuffix: jest.fn(() => "std"),
  getMediaQueryMixinName: jest.fn(() => "media-breakpoint-up"),
  useRelativeUnits: jest.fn(() => false),
  getRelativeUnitBaseLength: jest.fn(() => "16"),
}));

const methods = {
  findColorByHexAndAlpha: jest.fn,
  findColorByName: jest.fn,
  findColorEqual: jest.fn,
  findSpacingTokenByName: jest.fn,
  findSpacingTokenByValue: jest.fn,
  findTextStyleByName: jest.fn,
  findTextStyleEqual: jest.fn,
};

describe("text-styles", () => {
  test("text styles correctly fetched from context", () => {
    const context = {
      project: {
        type: "web",
        name: "PROJECT",
        colors: [],
        textStyles: [
          {
            color: {
              a: 1,
              b: 20,
              g: 20,
              name: "black-one",
              originalName: "black-one",
              r: 20,
              sourceId: "DC40ECF7-D656-412F-BA81-DB7D6DCA5090",
            },
            fontFace: "Roboto-Light",
            fontFamily: "Roboto",
            fontSize: 16,
            fontStretch: "normal",
            fontStyle: "normal",
            letterSpacing: 0,
            lineHeight: 24,
            name: "xs/inputtext/one/std",
            scaledFontSize: 18,
            weightText: "light",
          },
        ],
        spacingSections: [
          {
            name: "Spacing",
            description: "Add your spacing documentation here, _using markdown_.",
            spacingTokens: [],
          },
        ],
        remPreferences: {
          useForFontSizes: false,
          useForMeasurements: false,
          rootFontSize: 16,
        },
        density: "1x",
        densityDivisor: 1,
        lengthUnit: "px",
        textLengthUnit: "dp",
        linkedStyleguide: {
          type: "base",
          name: "COMPONENTS",
          colors: [],
          textStyles: [],
          spacingSections: [
            {
              name: "Spacing",
              description: "Add your spacing documentation here, _using markdown_.",
              spacingTokens: [],
            },
          ],
          remPreferences: {},
          density: "1x",
          parent: {
            type: "base",
            name: "MASTER",
            colors: [],
            textStyles: [],
            spacingSections: [
              {
                name: "Spacing",
                description: "Add your spacing documentation here, _using markdown_.",
                spacingTokens: [],
              },
            ],
            remPreferences: {},
            density: "1x",
            densityDivisor: 1,
            lengthUnit: "px",
            textLengthUnit: "dp",
            ...methods,
          },
          densityDivisor: 1,
          lengthUnit: "px",
          textLengthUnit: "dp",
          ...methods,
        },
        ...methods,
      },
      getOption: jest.fn,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const textStyles = getTextStylesFromContext(context);
    expect(textStyles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: {
            a: 1,
            b: 20,
            g: 20,
            name: "black-one",
            originalName: "black-one",
            r: 20,
            sourceId: "DC40ECF7-D656-412F-BA81-DB7D6DCA5090",
          },
          fontFace: "Roboto-Light",
          fontFamily: "Roboto",
          fontSize: 16,
          fontStretch: "normal",
          fontStyle: "normal",
          letterSpacing: 0,
          lineHeight: 24,
          name: "xs/inputtext/one/std",
          scaledFontSize: 18,
          weightText: "light",
        }),
      ]),
    );
  });

  test("text style standard suffix correctly removed", () => {
    const context = {
      project: {
        type: "web",
        name: "PROJECT",
        colors: [],
        textStyles: [
          {
            color: {
              a: 1,
              b: 20,
              g: 20,
              name: "black-one",
              originalName: "black-one",
              r: 20,
              sourceId: "DC40ECF7-D656-412F-BA81-DB7D6DCA5090",
            },
            fontFace: "Roboto-Light",
            fontFamily: "Roboto",
            fontSize: 16,
            fontStretch: "normal",
            fontStyle: "normal",
            letterSpacing: 0,
            lineHeight: 24,
            name: "xs/inputtext/one/std",
            scaledFontSize: 18,
            weightText: "light",
          },
        ],
        spacingSections: [
          {
            name: "Spacing",
            description: "Add your spacing documentation here, _using markdown_.",
            spacingTokens: [],
          },
        ],
        remPreferences: {
          useForFontSizes: false,
          useForMeasurements: false,
          rootFontSize: 16,
        },
        density: "1x",
        densityDivisor: 1,
        lengthUnit: "px",
        textLengthUnit: "dp",
        linkedStyleguide: {
          type: "base",
          name: "COMPONENTS",
          colors: [],
          textStyles: [],
          spacingSections: [
            {
              name: "Spacing",
              description: "Add your spacing documentation here, _using markdown_.",
              spacingTokens: [],
            },
          ],
          remPreferences: {},
          density: "1x",
          parent: {
            type: "base",
            name: "MASTER",
            colors: [],
            textStyles: [],
            spacingSections: [
              {
                name: "Spacing",
                description: "Add your spacing documentation here, _using markdown_.",
                spacingTokens: [],
              },
            ],
            remPreferences: {},
            density: "1x",
            densityDivisor: 1,
            lengthUnit: "px",
            textLengthUnit: "dp",
            ...methods,
          },
          densityDivisor: 1,
          lengthUnit: "px",
          textLengthUnit: "dp",
          ...methods,
        },
        ...methods,
      },
      getOption: jest.fn,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const textStyles = getTextStylesFromContext(context);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const normalizedTextStyles = normalizeTextStyles(context, textStyles);
    expect(normalizedTextStyles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          baseBreakpoint: "xs",
          name: "inputtext-one",
        }),
      ]),
    );
  });

  test("text style correctly includes modified options", () => {
    const context = {
      project: {
        type: "web",
        name: "PROJECT",
        colors: [],
        textStyles: [
          {
            color: {
              a: 1,
              b: 20,
              g: 20,
              name: "black-one",
              originalName: "black-one",
              r: 20,
              sourceId: "DC40ECF7-D656-412F-BA81-DB7D6DCA5090",
            },
            fontFace: "Roboto-Light",
            fontFamily: "Roboto",
            fontSize: 16,
            fontStretch: "normal",
            fontStyle: "normal",
            letterSpacing: 0,
            lineHeight: 24,
            name: "xs/inputtext/one/ta:center",
            scaledFontSize: 18,
            weightText: "light",
            textAlign: "center",
          },
          {
            color: {
              a: 1,
              b: 20,
              g: 20,
              name: "black-one",
              originalName: "black-one",
              r: 20,
              sourceId: "DC40ECF7-D656-412F-BA81-DB7D6DCA5090",
            },
            fontFace: "Roboto-Light",
            fontFamily: "Roboto",
            fontSize: 16,
            fontStretch: "normal",
            fontStyle: "normal",
            letterSpacing: 0,
            lineHeight: 24,
            name: "xs/inputtext/one/std",
            scaledFontSize: 18,
            weightText: "light",
          },
        ],
        spacingSections: [
          {
            name: "Spacing",
            description: "Add your spacing documentation here, _using markdown_.",
            spacingTokens: [],
          },
        ],
        remPreferences: {
          useForFontSizes: false,
          useForMeasurements: false,
          rootFontSize: 16,
        },
        density: "1x",
        densityDivisor: 1,
        lengthUnit: "px",
        textLengthUnit: "dp",
        linkedStyleguide: {
          type: "base",
          name: "COMPONENTS",
          colors: [],
          textStyles: [],
          spacingSections: [
            {
              name: "Spacing",
              description: "Add your spacing documentation here, _using markdown_.",
              spacingTokens: [],
            },
          ],
          remPreferences: {},
          density: "1x",
          parent: {
            type: "base",
            name: "MASTER",
            colors: [],
            textStyles: [],
            spacingSections: [
              {
                name: "Spacing",
                description: "Add your spacing documentation here, _using markdown_.",
                spacingTokens: [],
              },
            ],
            remPreferences: {},
            density: "1x",
            densityDivisor: 1,
            lengthUnit: "px",
            textLengthUnit: "dp",
            ...methods,
          },
          densityDivisor: 1,
          lengthUnit: "px",
          textLengthUnit: "dp",
          ...methods,
        },
        ...methods,
      },
      getOption: jest.fn,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const textStyles = getTextStylesFromContext(context);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const normalizedTextStyles = normalizeTextStyles(context, textStyles);
    expect(normalizedTextStyles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          options: [
            {
              errors: [],
              name: "inputtext-one-center",
              properties: [{ errors: [], name: "center", property: "text-align", value: "center" }],
            },
          ],
        }),
      ]),
    );
  });

  test("text style correctly throws an error if naming is wrong", () => {
    const context = {
      project: {
        type: "web",
        name: "PROJECT",
        colors: [],
        textStyles: [
          {
            color: {
              a: 1,
              b: 20,
              g: 20,
              name: "black-one",
              originalName: "black-one",
              r: 20,
              sourceId: "DC40ECF7-D656-412F-BA81-DB7D6DCA5090",
            },
            fontFace: "Roboto-Light",
            fontFamily: "Roboto",
            fontSize: 16,
            fontStretch: "normal",
            fontStyle: "normal",
            letterSpacing: 0,
            lineHeight: 24,
            name: "xs/inputtext/one",
            scaledFontSize: 18,
            weightText: "light",
          },
        ],
        spacingSections: [
          {
            name: "Spacing",
            description: "Add your spacing documentation here, _using markdown_.",
            spacingTokens: [],
          },
        ],
        remPreferences: {
          useForFontSizes: false,
          useForMeasurements: false,
          rootFontSize: 16,
        },
        density: "1x",
        densityDivisor: 1,
        lengthUnit: "px",
        textLengthUnit: "dp",
        linkedStyleguide: {
          type: "base",
          name: "COMPONENTS",
          colors: [],
          textStyles: [],
          spacingSections: [
            {
              name: "Spacing",
              description: "Add your spacing documentation here, _using markdown_.",
              spacingTokens: [],
            },
          ],
          remPreferences: {},
          density: "1x",
          parent: {
            type: "base",
            name: "MASTER",
            colors: [],
            textStyles: [],
            spacingSections: [
              {
                name: "Spacing",
                description: "Add your spacing documentation here, _using markdown_.",
                spacingTokens: [],
              },
            ],
            remPreferences: {},
            density: "1x",
            densityDivisor: 1,
            lengthUnit: "px",
            textLengthUnit: "dp",
            ...methods,
          },
          densityDivisor: 1,
          lengthUnit: "px",
          textLengthUnit: "dp",
          ...methods,
        },
        ...methods,
      },
      getOption: jest.fn,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const textStyles = getTextStylesFromContext(context);
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      normalizeTextStyles(context, textStyles);
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          "Text style naming for xs/inputtext/one is broken. Make sure you use the minimal structure of breakpoint/name/hierarchy",
        );
      }
    }
  });
});
