import * as zem from "zem";
import { getMediaQueryMixinName } from "./config";
import { code, codeExport } from "./helpers/zem";
import { extractAllErrors, normalizeName, normalizeTextStyles } from "./normalize/index";

import colorTemplate from "./templates/colors.njk";
import layerTemplate from "./templates/layer.njk";
import textStylesTemplate from "./templates/text-styles.njk";
import { getTextStylesFromContext, getColorsFromContext } from "./helpers/context";

// DEPRECATED
function comment(_context: zem.Context, text: string): string {
  return `/* ${text} */`;
}

function layer(context: zem.Context, selectedLayer: zem.Layer): zem.CodeObject {
  try {
    if (selectedLayer.type !== "text") {
      return code(comment(context, ``));
    }

    // DEPRECATED
    if (selectedLayer.textStyles.length === 0) {
      return code(comment(context, `There aren't any text styles for the selected element.`));
    }

    let textStyle;

    if (context.project) {
      textStyle = context.project.findTextStyleEqual(selectedLayer.textStyles[0].textStyle);
    } else if (context.styleguide) {
      textStyle = context.styleguide.findTextStyleEqual(selectedLayer.textStyles[0].textStyle);
    }

    // DEPRECATED
    if (!textStyle) {
      return code(comment(context, `Couldn't find text style.`));
    }

    return code(layerTemplate.render({ textStyle: normalizeName(context, textStyle) }));
  } catch (error) {
    if (error instanceof Error) {
      // DEPRECATED
      return code(comment(context, `${error}\n${error.stack}`));
    }
    return code(comment(context, `${error}`));
  }
}

// DEPRECATED
function styleguideColors(context: zem.Context, colors: readonly zem.Color[]): zem.CodeObject {
  try {
    return code(colorTemplate.render({ colors }));
  } catch (error) {
    if (error instanceof Error) {
      return code(comment(context, `${error}\n${error.stack}`));
    }
    return code(comment(context, `${error}`));
  }
}

function colors(context: zem.Context): zem.CodeObject {
  const colors = getColorsFromContext(context);

  try {
    return code(colorTemplate.render({ colors }));
  } catch (error) {
    if (error instanceof Error) {
      // DEPRECATED
      return code(comment(context, `${error}\n${error.stack}`));
    }
    return code(comment(context, `${error}`));
  }
}

// DEPRECATED
function exportStyleguideColors(context: zem.Context, colors: readonly zem.Color[]): zem.CodeExportObject {
  return codeExport(styleguideColors(context, colors), "colors.scss");
}

function exportColors(context: zem.Context): zem.CodeExportObject {
  return codeExport(colors(context), "colors.scss");
}

// DEPRECATED
function styleguideTextStyles(context: zem.Context, textStyles: readonly zem.TextStyle[]): zem.CodeObject {
  try {
    const normalizedTextStyles = normalizeTextStyles(context, textStyles);
    return code(
      textStylesTemplate.render({
        globalErrors: extractAllErrors(normalizedTextStyles),
        mediaQueryMixinName: getMediaQueryMixinName(context),
        textStyles: normalizedTextStyles,
      }),
    );
  } catch (error) {
    if (error instanceof Error) {
      return code(comment(context, `${error}\n${error.stack}`));
    }
    return code(comment(context, `${error}`));
  }
}

function textStyles(context: zem.Context): zem.CodeObject {
  const textStyles = getTextStylesFromContext(context);
  try {
    const normalizedTextStyles = normalizeTextStyles(context, textStyles);
    return code(
      textStylesTemplate.render({
        globalErrors: extractAllErrors(normalizedTextStyles),
        mediaQueryMixinName: getMediaQueryMixinName(context),
        textStyles: normalizedTextStyles,
      }),
    );
  } catch (error) {
    if (error instanceof Error) {
      // DEPRECATED
      return code(comment(context, `${error}\n${error.stack}`));
    }
    return code(comment(context, `${error}`));
  }
}

// DEPRECATED
function exportStyleguideTextStyles(context: zem.Context, textStyles: readonly zem.TextStyle[]): zem.CodeExportObject {
  return codeExport(styleguideTextStyles(context, textStyles), "text-styles.scss");
}

function exportTextStyles(context: zem.Context): zem.CodeExportObject {
  return codeExport(textStyles(context), "text-styles.scss");
}

const extension: zem.Extension = {
  comment, // DEPRECATED
  exportStyleguideColors, // DEPRECATED
  exportColors,
  exportStyleguideTextStyles, // DEPRECATED
  exportTextStyles,
  layer,
  styleguideColors, // DEPRECATED
  colors,
  styleguideTextStyles, // DEPRECATED
  textStyles,
};
export default extension;
