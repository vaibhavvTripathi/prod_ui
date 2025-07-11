import { describe, it, expect } from "vitest";
import { parseCodexityCodeBlock } from "@/helper/parser";
import { StepType } from "@/types/steps";

describe("parseCodexity", () => {
  it("parses a <codexity-write> block", () => {
    const input = `
    Some gibberesh
<codexity-write file_path="src/index.ts">
console.log("hello");
</codexity-write>
`;
    const result = parseCodexityCodeBlock(input);
    expect(result[0]?.type).toEqual("CreateOrUpdateFile");
    expect(result[0]?.filePath).toEqual("src/index.ts");
  });

  it("parses a <codexity-rename> block", () => {
    const input = `<codexity-rename original_file_path="src/a.ts" new_file_path="src/b.ts" />`;
    const result = parseCodexityCodeBlock(input);
    expect(result).toEqual([
      {
        type: StepType.RenameFile,
        filePath: "src/a.ts",
        newPath: "src/b.ts",
      },
    ]);
  });

  it("parses a <codexity-delete> block", () => {
    const input = `<codexity-delete file_path="src/old.ts" />`;
    const result = parseCodexityCodeBlock(input);
    expect(result).toEqual([
      {
        type: StepType.DeleteFile,
        filePath: "src/old.ts",
      },
    ]);
  });

  it("parses a <codexity-add-dependency> block", () => {
    const input = `<codexity-add-dependency>uuid@1.2</codexity-add-dependency>`;
    const result = parseCodexityCodeBlock(input);
    expect(result).toEqual([
      {
        type: StepType.AddDependency,
        dependency: "uuid",
        version: "1.2",
      },
    ]);
  });

  it("parses multiple operations in one string", () => {
    const input = `
    <codexity-add-dependency>chalk@5</codexity-add-dependency>
    <codexity-delete file_path="src/old.ts" />
    <codexity-rename original_file_path="src/temp.ts" new_file_path="src/final.ts" />
<codexity-write file_path="src/one.ts">
console.log("one");
</codexity-write>
Let's rename src/types/note_temp.ts to src/types/note.ts.
<codexity-rename original_file_path="src/types/note_temp.ts" new_file_path="src/types/note.ts" />
`;
    const result = parseCodexityCodeBlock(input);
    expect(result).toEqual([
      {
        type: StepType.CreateOrUpdateFile,
        filePath: "src/one.ts",
        content: 'console.log("one");\n',
      },
      {
        type: StepType.RenameFile,
        filePath: "src/temp.ts",
        newPath: "src/final.ts",
      },
      {
        type: StepType.RenameFile,
        filePath: "src/types/note_temp.ts",
        newPath: "src/types/note.ts",
      },
      {
        type: StepType.DeleteFile,
        filePath: "src/old.ts",
      },
      {
        type: StepType.AddDependency,
        dependency: "chalk",
        version: "5",
      },
    ]);
  });

  it("parses partial response basic test", () => {
    const input = `
    <codexity-add-dependency>chalk@5</codexity-add-dependency>
    <codexity-delete file_path="src/old.ts" />
    <codexity-rename original_file_path="src/temp.ts" new_file_path="src/final.ts" />
<codexity-write file_path="src/one.ts">
console.log("one");

`;
    const result = parseCodexityCodeBlock(input);
    expect(result).toEqual([
      {
        type: StepType.RenameFile,
        filePath: "src/temp.ts",
        newPath: "src/final.ts",
      },
      {
        type: StepType.DeleteFile,
        filePath: "src/old.ts",
      },
      {
        type: StepType.AddDependency,
        dependency: "chalk",
        version: "5",
      },
    ]);
  });
  it("parses partial response for rigourous test", () => {
    const input = `
    <codexity-add-dependency>chalk@5</codexity-add-dependency>
    <codexity-delete 
    <codexity-rename original_file_path="src/temp.ts" new_file_path="src/final.ts" />
<codexity-write file_path="src/one.ts">
console.log("one");

`;
    const result = parseCodexityCodeBlock(input);
    expect(result).toEqual([
      {
        type: StepType.RenameFile,
        filePath: "src/temp.ts",
        newPath: "src/final.ts",
      },

      {
        type: StepType.AddDependency,
        dependency: "chalk",
        version: "5",
      },
    ]);
  });
});
