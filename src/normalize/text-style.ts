import { IContext, ITextStyle } from "zem";
import { BREAKPOINTS } from "./constant";
import { normalize as normalizeName } from "./name";
import { normalizeAll as normalizeProperties } from "./property";
import { INormalizedName, INormalizedProperty, INormalizedTextStyle } from "./types";

export function normalize(context: IContext, textStyles: ReadonlyArray<ITextStyle>): any {
  return Object.values(textStyles
    .map((textStyle) => ({ textStyle, name: normalizeName(context, textStyle) }))
    .map(({ name, textStyle }) => ({ name, textStyle, properties: normalizeProperties(context, textStyle) }))
    .sort(
      (
        { name: { name: nameA, breakpoint: breakpointA } },
        { name: { name: nameB, breakpoint: breakpointB } },
      ) => {
        if (nameA > nameB) { return 1; }
        if (nameA < nameB) { return -1; }
        const breakpointAIndex = BREAKPOINTS.indexOf(breakpointA);
        const breakpointBIndex = BREAKPOINTS.indexOf(breakpointB);
        if (breakpointAIndex > breakpointBIndex) { return 1; }
        if (breakpointAIndex < breakpointBIndex) { return -1; }
        return 0;
      },
    )
    .reduce((acc, { name, textStyle, properties }) => mergeTextStyle(acc, name, properties), {}),
  )
    .map(removeDuplicatedStyles);
}

function mergeTextStyle(
  acc: Record<string, INormalizedTextStyle>,
  name: INormalizedName,
  properties: INormalizedProperty[],
): Record<string, INormalizedTextStyle> {
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

function newTextStyle(name: INormalizedName, properties: INormalizedProperty[]): INormalizedTextStyle {
  return incorporateChanges({
    baseBreakpoint: name.breakpoint,
    breakpoints: [],
    name: name.baseName,
    options: [],
    properties,
  }, name, properties);
}

function incorporateChanges(
  before: INormalizedTextStyle,
  name: INormalizedName,
  properties: INormalizedProperty[],
): INormalizedTextStyle {
  if (name.breakpoint !== before.baseBreakpoint) {
    const existsingBreakpoint = before.breakpoints.find(({ name: compareName }) => compareName === name.breakpoint);
    if (existsingBreakpoint) {
      before = {
        ...before,
        breakpoints: [
          ...[...before.breakpoints].splice(before.breakpoints.indexOf(existsingBreakpoint)),
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
            properties,
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
  if (name.name !== before.name) {
    const existingOption = before.options.find(({ name: compareName }) => compareName === name.name);

    if (existingOption) {
      before = {
        ...before,
        options: [
          ...[...before.options].splice(before.options.indexOf(existingOption)),
          {
            ...existingOption,
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
            name: name.name,
            properties: name.modifiedProperties,
          },
        ],
      };
    }
  }
  return before;
}

function checkProperties(
  propertiesBefore: ReadonlyArray<INormalizedProperty>,
  propertiesNew: ReadonlyArray<INormalizedProperty>,
  name: INormalizedName,
): ReadonlyArray<INormalizedProperty> {
  return propertiesNew.reduce((acc, newProperty) => {
    const propertyBefore = propertiesBefore.find(({ property }) => property === newProperty.property);
    if (name.modifiedProperties.find(({ property: compareProperty }) => compareProperty === newProperty.property)) {
      return [...acc, propertyBefore];
    }
    if (propertyBefore.value === newProperty.value) {
      return [...acc, propertyBefore];
    }
    return [
      ...acc,
      {
        ...propertyBefore,
        errors: [
          ...propertyBefore.errors,
          `${name.name} differs (${propertyBefore.value} => ${newProperty.value})`,
        ],
      },
    ];
  }, []);
}

function removeDuplicatedStyles(textStyle: INormalizedTextStyle): INormalizedTextStyle {
  return {
    ...textStyle,
    breakpoints: textStyle.breakpoints.map((breakpoint) => {
      return {
        ...breakpoint,
        properties: breakpoint.properties.filter(({ property, value }) => {
          const compareProperty = textStyle.properties.find(
            ({ property: comparePropertyName }) => comparePropertyName === property,
          );
          if (!compareProperty) { return true; }
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
          if (!compareProperty) { return true; }
          return compareProperty.value !== value;
        }),
      };
    }),
  };
}
