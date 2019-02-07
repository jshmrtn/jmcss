import * as zem from "zem";

export function code(codeObject: string): zem.ICodeObject {
  return {
    code: codeObject,
    language: "scss",
  };
}

export function codeExport(codeObjectOrString: zem.ICodeObject | string, filename: string): zem.ICodeExportObject {
  if (typeof codeObjectOrString === "string") {
    codeObjectOrString = code(codeObjectOrString);
  }
  return {
    ...codeObjectOrString,
    filename,
  };
}
