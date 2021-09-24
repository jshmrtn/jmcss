import { Context, HexColor, TextStyle } from "zem";
import { getSplitSymbol, getStandardSuffix } from "../config";
import { INCLUDED_PROPERTIES, MODIFIERS } from "./constant";
import { normalize as normalizeProperty } from "./property";
import { NormalizedName } from "./types";

function isIncludedProperty(
  propertyName: string | keyof typeof INCLUDED_PROPERTIES,
): propertyName is keyof typeof INCLUDED_PROPERTIES {
  return INCLUDED_PROPERTIES.hasOwnProperty(propertyName);
}

export function normalize(context: Context, textStyle: TextStyle): NormalizedName {
  const [breakpoint, name, hierarchy, ...rest] = textStyle.name.split(getSplitSymbol(context));

  if (rest.length === 0 || !breakpoint || !name || !hierarchy) {
    throw new Error(
      `Text style naming for ${textStyle.name} is broken. Make sure you use the minimal structure of breakpoint/name/hierarchy`,
    );
  }

  const modifiedProperties =
    rest.length === 1 && rest[0] === getStandardSuffix(context)
      ? []
      : rest
          .map((modifier) => {
            const [prefix, value] = modifier.split(":");

            if (!MODIFIERS[prefix]) {
              throw new Error(`Modifier with prefix "${prefix}" is defined.`);
            }

            if (MODIFIERS[prefix].values && !MODIFIERS[prefix].values?.includes(value)) {
              throw new Error(`Value "${value}"for modifier with prefix ${prefix} is not allowed.`);
            }

            return { prefix, value };
          })
          .map(({ prefix, value }: { prefix: string; value: string }) => {
            const propertyName = MODIFIERS[prefix].property;
            if (isIncludedProperty(propertyName)) {
              const key: string = INCLUDED_PROPERTIES[propertyName];
              const textStyleCoerced = textStyle as unknown as Record<string, number | string | Color>;
              const textStyleValue: number | string | HexColor = textStyleCoerced[key];
              return {
                name: value,
                ...normalizeProperty(context, propertyName, textStyleValue, textStyle),
              };
            }
            return {
              errors: [],
              name: value,
              property: MODIFIERS[prefix].property,
              value,
            };
          });

  let modifiersNameSubfix = modifiedProperties
    .map(({ name: modifierName }: { name: string }): string => modifierName)
    .join("-");

  if (modifiersNameSubfix.length > 0) {
    modifiersNameSubfix = "-" + modifiersNameSubfix;
  }

  return {
    baseName: `${name}-${hierarchy}`,
    breakpoint,
    modifiedProperties,
    name: `${name}-${hierarchy}${modifiersNameSubfix}`,
  };
}
