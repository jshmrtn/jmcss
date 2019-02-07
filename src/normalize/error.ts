import { IGlobalError, INormalizedTextStyle } from "./types";

export function extractAllErrors(textStyles: ReadonlyArray<INormalizedTextStyle>): ReadonlyArray<IGlobalError> {
  return textStyles.flatMap((textStyle) => ([
    ...textStyle.properties.flatMap(({ property, errors }) => errors.map((error) => ({
      message: error,
      property,
      textStyleName: textStyle.name,
    }))),
    ...textStyle.breakpoints.flatMap(
      (breakpoint) => breakpoint.properties.flatMap(({ property, errors }) => errors.map((error) => ({
        message: error,
        property,
        textStyleName: textStyle.name,
      }))),
    ),
    ...textStyle.options.flatMap(
      (option) => option.properties.flatMap(({ property, errors }) => errors.map((error) => ({
        message: error,
        property,
        textStyleName: option.name,
      }))),
    ),
  ]));
}
