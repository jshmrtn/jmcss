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

  // console.debug("getTextStylesFromContext", context);
  // console.debug("containerType", containerType);

  const textStyles: zem.TextStyle[] = [];

  if (containerType === CONTAINER_TYPE.PROJECT) {
    if (context?.project?.textStyles !== undefined) {
      textStyles.push(...context?.project?.textStyles);
    }
    if (context?.project?.linkedStyleguide?.textStyles !== undefined) {
      textStyles.push(...context?.project?.linkedStyleguide.textStyles);
    }
  } else if (containerType === CONTAINER_TYPE.STYLEGUIDE && context.styleguide?.textStyles) {
    textStyles.push(...context.styleguide.textStyles);
  }
  return textStyles;
}

export function getColorsFromContext(context: zem.Context): readonly zem.Color[] {
  const containerType =
    CONTAINER_TYPE.STYLEGUIDE in context && context.styleguide !== undefined
      ? CONTAINER_TYPE.STYLEGUIDE
      : CONTAINER_TYPE.PROJECT;

  // console.debug("getColorsFromContext", context);
  // console.debug("containerType", containerType);

  const colors: zem.Color[] = [];

  if (containerType === CONTAINER_TYPE.PROJECT) {
    if (context?.project?.colors !== undefined) {
      colors.push(...context?.project?.colors);
    }
    if (context?.project?.linkedStyleguide?.colors !== undefined) {
      colors.push(...context?.project?.linkedStyleguide.colors);
    }
  } else if (containerType === CONTAINER_TYPE.STYLEGUIDE && context.styleguide?.colors) {
    colors.push(...context.styleguide.colors);
  }
  return colors;
}
