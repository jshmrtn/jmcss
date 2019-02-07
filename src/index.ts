import * as zem from "zem";
import { getMediaQueryMixinName } from "./config";
import { code, codeExport } from "./helpers/zem";
import { extractAllErrors, normalizeName, normalizeTextStyles } from "./normalize/index";

import colorTemplate from "./templates/colors.njk";
import layerTemplate from "./templates/layer.njk";
import textStylesTemplate from "./templates/text-styles.njk";

function comment(context: zem.IContext, text: string): string {
  return `/* ${text} */`;
}

function layer(context: zem.IContext, selectedLayer: zem.ILayer): zem.ICodeObject {
  try {
    if (selectedLayer.type !== "text") { return; }

    if (selectedLayer.textStyles.length === 0) {
      return code(comment(
        context,
        `There aren't any text styles for the selected element.`,
      ));
    }

    const textStyle = context.project.findTextStyleEqual(
      selectedLayer.textStyles[0].textStyle,
    );

    if (!textStyle) {
      return code(comment(context, `Couldn't find text style.`));
    }

    return code(layerTemplate.render({ textStyle: normalizeName(context, textStyle) }));
  } catch (e) {
    return code(comment(context, `${e}\n${e.stack}`));
  }
}
// function screen(context: zem.Context, selectedVersion: zem.Version, selectedScreen: zem.Screen): zem.CodeObject {}
// function component(
//   context: zem.CodeObject,
//   selectedVersion: zem.Version,
//   selectedComponent: zem.Component
// ): zem.CodeObject {}

function styleguideColors(context: zem.IContext, colors: ReadonlyArray<zem.IColor>): zem.ICodeObject {
  try {
    return code(colorTemplate.render({ colors }));
  } catch (e) {
    return code(comment(context, `${e}\n${e.stack}`));
  }
}

function exportStyleguideColors(context: zem.IContext, colors: ReadonlyArray<zem.IColor>): zem.ICodeExportObject {
  return codeExport(styleguideColors(context, colors), "colors.scss");
}

function styleguideTextStyles(context: zem.IContext, textStyles: ReadonlyArray<zem.ITextStyle>): zem.ICodeObject {
  try {
    const normalizedTextStyles = normalizeTextStyles(context, textStyles);
    return code(textStylesTemplate.render({
      globalErrors: extractAllErrors(normalizedTextStyles),
      mediaQueryMixinName: getMediaQueryMixinName(context),
      textStyles: normalizedTextStyles,
    }));
  } catch (e) {
    return code(comment(context, `${e}\n${e.stack}`));
  }
}

function exportStyleguideTextStyles(
  context: zem.IContext,
  textStyles: ReadonlyArray<zem.ITextStyle>,
): zem.ICodeExportObject {
  return codeExport(styleguideTextStyles(context, textStyles), "text-styles.scss");
}

const extension: zem.IExtension = {
  comment,
  exportStyleguideColors,
  exportStyleguideTextStyles,
  layer,
  styleguideColors,
  styleguideTextStyles,
};
export default extension;
