import { GlobalError, NormalizedTextStyle } from "./types";

export function extractAllErrors(textStyles: readonly NormalizedTextStyle[]): readonly GlobalError[] {
  return textStyles.flatMap((textStyle) => [
    ...textStyle.properties.flatMap(({ property, errors }) =>
      errors.map((error) => ({
        message: error,
        property,
        textStyleName: textStyle.name,
      })),
    ),
    ...textStyle.breakpoints.flatMap((breakpoint) =>
      breakpoint.properties.flatMap(({ property, errors }) =>
        errors.map((error) => ({
          message: error,
          property,
          textStyleName: textStyle.name,
        })),
      ),
    ),
    ...textStyle.options.flatMap((option) =>
      option.properties.flatMap(({ property, errors }) =>
        errors.map((error) => ({
          message: error,
          property,
          textStyleName: option.name,
        })),
      ),
    ),
  ]);
}
