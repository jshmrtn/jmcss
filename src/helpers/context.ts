import * as zem from "zem";

enum CONTAINER_TYPE {
  "STYLEGUIDE" = "styleguide",
  "PROJECT" = "project",
}

export function getTextStylesFromContext(context: zem.Context): readonly zem.TextStyle[] {
  const containerType =
    CONTAINER_TYPE.STYLEGUIDE in context && context.styleguide !== undefined
      ? CONTAINER_TYPE.STYLEGUIDE
      : CONTAINER_TYPE.PROJECT;
  console.log("getTextStylesFromContext", context);
  console.log("containerType", containerType);
  let textStyles;
  if (containerType === CONTAINER_TYPE.PROJECT) {
    textStyles = [...context.project.textStyles, ...context.project.linkedStyleguide.textStyles];
  } else if (containerType === CONTAINER_TYPE.STYLEGUIDE) {
    textStyles = context.styleguide.textStyles;
  }
  return textStyles;
}

export function getColorsFromContext(context: zem.Context): readonly zem.Color[] {
  const containerType =
    CONTAINER_TYPE.STYLEGUIDE in context && context.styleguide !== undefined
      ? CONTAINER_TYPE.STYLEGUIDE
      : CONTAINER_TYPE.PROJECT;
  console.log("getColorsFromContext", context);
  console.log("containerType", containerType);
  let colors;
  if (containerType === CONTAINER_TYPE.PROJECT) {
    colors = [...context.project.colors, ...context.project.linkedStyleguide.colors];
  } else if (containerType === CONTAINER_TYPE.STYLEGUIDE) {
    colors = context.styleguide.colors;
  }
  return colors;
}
