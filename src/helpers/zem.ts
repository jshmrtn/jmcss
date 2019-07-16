import * as zem from "zem";

export function code(codeObject: string): zem.CodeObject {
  return {
    code: codeObject,
    language: "scss",
  };
}

export function codeExport(codeObjectOrString: zem.CodeObject | string, filename: string): zem.CodeExportObject {
  if (typeof codeObjectOrString === "string") {
    codeObjectOrString = code(codeObjectOrString);
  }
  return {
    ...codeObjectOrString,
    filename,
  };
}
