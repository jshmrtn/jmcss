import { Context, TextStyle } from "zem";
import { BREAKPOINTS } from "./constant";
import { normalize as normalizeName } from "./name";
import { addDefaultProperties, normalizeAll as normalizeProperties } from "./property";
import { NormalizedName, NormalizedProperty, NormalizedTextStyle } from "./types";

function arrayWithout<T>(list: readonly T[], toRemove: T): readonly T[] {
  const index = list.indexOf(toRemove);
  if (index < 0) {
    return list;
  }
  return [...list.slice(0, index), ...list.slice(index + 1)];
}

function checkProperties(
  propertiesBefore: readonly NormalizedProperty[],
  propertiesNew: readonly NormalizedProperty[],
  name: NormalizedName,
): readonly NormalizedProperty[] {
  return propertiesNew.reduce((acc: readonly NormalizedProperty[], newProperty) => {
    const propertyBefore = acc.find(({ property }) => property === newProperty.property);
    const modifierProperty = !!name.modifiedProperties.find(
      ({ property: compareProperty }) => compareProperty === newProperty.property,
    );

    if (modifierProperty) {
      return acc;
    }

    if (!propertyBefore) {
      return [...acc, newProperty];
    }

    if (propertyBefore.value !== newProperty.value) {
      return [
        ...arrayWithout(acc, propertyBefore),
        {
          ...propertyBefore,
          errors: [...propertyBefore.errors, `${name.name} differs (${propertyBefore.value} => ${newProperty.value})`],
        },
      ];
    }

    return acc;
  }, propertiesBefore);
}

function removeDuplicatedStyles(textStyle: NormalizedTextStyle): NormalizedTextStyle {
  return {
    ...textStyle,
    breakpoints: textStyle.breakpoints.map((breakpoint) => {
      return {
        ...breakpoint,
        properties: breakpoint.properties.filter(({ property, value }) => {
          const compareProperty = textStyle.properties.find(
            ({ property: comparePropertyName }) => comparePropertyName === property,
          );
          if (!compareProperty) {
            return true;
          }
          return compareProperty.value !== value;
        }),
      };
    }),
    options: textStyle.options.map((option) => {
      return {
        ...option,
        properties: option.properties.filter(({ property, value }) => {
          const compareProperty = textStyle.properties.find(
            ({ property: comparePropertyName }) => comparePropertyName === property,
          );
          if (!compareProperty) {
            return true;
          }
          return compareProperty.value !== value;
        }),
      };
    }),
  };
}

function checkOptionErrors(
  baseProperties: readonly NormalizedProperty[],
  properties: readonly NormalizedProperty[],
  modifiedProperties: readonly NormalizedProperty[],
): readonly string[] {
  return properties
    .map((property) => {
      const modifiedProperty = modifiedProperties.find(
        ({ property: comparePropertyName }) => comparePropertyName === property.property,
      );
      if (modifiedProperty) {
        return null;
      }
      const oldProperty = baseProperties.find(
        ({ property: comparePropertyName }) => comparePropertyName === property.property,
      );
      if (!oldProperty) {
        return `Property ${property.property} was not defined on base style.`;
      }
      if (oldProperty.value !== property.value) {
        return `Property ${property.property} (${property.value}) differs from base style (${oldProperty.value}).`;
      }
      return null;
    })
    .filter((message): message is string => message !== null);
}

function incorporateChanges(
  before: NormalizedTextStyle,
  name: NormalizedName,
  properties: NormalizedProperty[],
): NormalizedTextStyle {
  if (name.breakpoint !== before.baseBreakpoint) {
    const existsingBreakpoint = before.breakpoints.find(({ name: compareName }) => compareName === name.breakpoint);
    if (existsingBreakpoint) {
      before = {
        ...before,
        breakpoints: [
          ...arrayWithout(before.breakpoints, existsingBreakpoint),
          {
            ...existsingBreakpoint,
            properties: checkProperties(existsingBreakpoint.properties, properties, name),
          },
        ],
      };
    } else {
      before = {
        ...before,
        breakpoints: [
          ...before.breakpoints,
          {
            name: name.breakpoint,
            properties: properties.filter((property) => {
              return !name.modifiedProperties.find((modifier) => modifier.property === property.property);
            }),
          },
        ],
      };
    }
  } else {
    before = {
      ...before,
      properties: checkProperties(before.properties, properties, name),
    };
  }
  if (name.name !== name.baseName) {
    const existingOption = before.options.find(({ name: compareName }) => compareName === name.name);

    const baseProperties =
      name.breakpoint === before.baseBreakpoint
        ? before.properties
        : before.breakpoints.find(({ name: compareName }) => compareName === name.breakpoint)?.properties;

    if (!baseProperties) {
      return before;
    }

    const errors = checkOptionErrors(baseProperties, properties, name.modifiedProperties);

    if (existingOption) {
      before = {
        ...before,
        options: [
          ...arrayWithout(before.options, existingOption),
          {
            ...existingOption,
            errors: [...existingOption.errors, ...errors],
            properties: checkProperties(existingOption.properties, name.modifiedProperties, name),
          },
        ],
      };
    } else {
      before = {
        ...before,
        options: [
          ...before.options,
          {
            errors,
            name: name.name,
            properties: name.modifiedProperties,
          },
        ],
      };
    }
  }
  return before;
}

function newTextStyle(name: NormalizedName, properties: NormalizedProperty[]): NormalizedTextStyle {
  return incorporateChanges(
    {
      baseBreakpoint: name.breakpoint,
      breakpoints: [],
      name: name.baseName,
      options: [],
      properties: properties.filter((property) => {
        return !name.modifiedProperties.find((modifier) => modifier.property === property.property);
      }),
    },
    name,
    properties,
  );
}

function mergeTextStyle(
  acc: Record<string, NormalizedTextStyle>,
  name: NormalizedName,
  properties: NormalizedProperty[],
): Record<string, NormalizedTextStyle> {
  if (acc[name.baseName]) {
    return {
      ...acc,
      [name.baseName]: incorporateChanges(acc[name.baseName], name, properties),
    };
  }
  return {
    ...acc,
    [name.baseName]: newTextStyle(name, properties),
  };
}

function removeEmptyBreakpoints(textStyle: NormalizedTextStyle): NormalizedTextStyle {
  return {
    ...textStyle,
    breakpoints: textStyle.breakpoints.filter(({ properties }) => properties.length > 0),
  };
}

function applyDefaultStyles(context: Context, textStyle: NormalizedTextStyle): NormalizedTextStyle {
  return {
    ...textStyle,
    breakpoints: textStyle.breakpoints.map((breakpoint) => ({
      ...breakpoint,
      properties: addDefaultProperties(context, breakpoint.properties),
    })),
    properties: addDefaultProperties(context, textStyle.properties),
  };
}

export function normalize(context: Context, textStyles: readonly TextStyle[]): readonly NormalizedTextStyle[] {
  return Object.values(
    textStyles
      .map((textStyle) => ({ textStyle, name: normalizeName(context, textStyle) }))
      .map(({ name, textStyle }) => ({ name, textStyle, properties: normalizeProperties(context, textStyle) }))
      .sort(
        (
          {
            name: {
              name: nameA,
              baseName: baseNameA,
              breakpoint: breakpointA,
              modifiedProperties: modifiedPropertiesA,
            },
          },
          {
            name: {
              name: nameB,
              baseName: baseNameB,
              breakpoint: breakpointB,
              modifiedProperties: modifiedPropertiesB,
            },
          },
        ) => {
          if (baseNameA > baseNameB) {
            return 1;
          }
          if (baseNameA < baseNameB) {
            return -1;
          }
          const breakpointAIndex = BREAKPOINTS.indexOf(breakpointA);
          const breakpointBIndex = BREAKPOINTS.indexOf(breakpointB);
          if (breakpointAIndex > breakpointBIndex) {
            return 1;
          }
          if (breakpointAIndex < breakpointBIndex) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          if (nameA < nameB) {
            return -1;
          }
          if (modifiedPropertiesA.length > modifiedPropertiesB.length) {
            return 1;
          }
          if (modifiedPropertiesA.length < modifiedPropertiesB.length) {
            return -1;
          }
          return 0;
        },
      )
      .reduce((acc, { name, properties }) => mergeTextStyle(acc, name, properties), {}),
  )
    .map((textStyle: NormalizedTextStyle) => applyDefaultStyles(context, textStyle))
    .map(removeDuplicatedStyles)
    .map(removeEmptyBreakpoints);
}
