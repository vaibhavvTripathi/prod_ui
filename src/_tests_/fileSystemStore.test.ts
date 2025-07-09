import { describe, it, expect, beforeEach } from "vitest";
import { FileItem } from "@/types/file";
import {
  createOrUpdateFile,
  deleteFile,
  renameFile,
} from "@/store/fileSystemStore";

describe("File System Store Helpers", () => {
  let initialTree: FileItem[];

  beforeEach(() => {
    initialTree = [
      {
        name: "src",
        type: "folder",
        path: "src",
        children: [
          {
            name: "index.ts",
            type: "file",
            content: "console.log('hi')",
            path: "src/index.ts",
          },
          {
            name: "lib",
            type: "folder",
            path: "src/lib",
            children: [
              {
                name: "util.ts",
                type: "file",
                content: "export const x = 1;",
                path: "src/lib/util.ts",
              },
            ],
          },
        ],
      },
      {
        name: "README.md",
        type: "file",
        content: "# Hello",
        path: "README.md",
      },
    ];
  });

  it("creates a new file at root", () => {
    const tree = createOrUpdateFile(initialTree, "newfile.txt", "abc");
    expect(
      tree.find((f) => f.name === "newfile.txt" && f.type === "file")
    ).toBeTruthy();
  });

  it("updates an existing file", () => {
    const tree = createOrUpdateFile(initialTree, "README.md", "updated");
    const file = tree.find((f) => f.name === "README.md") as FileItem;
    expect(file.content).toBe("updated");
  });

  it("creates a nested file and folders if needed", () => {
    const tree = createOrUpdateFile(
      initialTree,
      "src/components/Button.tsx",
      "btn"
    );
    const src = tree.find((f) => f.name === "src") as FileItem;
    const components = src.children?.find(
      (f) => f.name === "components"
    ) as FileItem;
    expect(components).toBeTruthy();
    expect(
      components.children?.find(
        (f) => f.name === "Button.tsx" && f.type === "file"
      )
    ).toBeTruthy();
  });

  it("renames a file to a new folder", () => {
    const tree = renameFile(
      initialTree,
      "src/index.ts",
      "src/components/App.tsx"
    );
    const src = tree.find((f) => f.name === "src") as FileItem;
    const components = src.children?.find(
      (f) => f.name === "components"
    ) as FileItem;
    expect(components).toBeTruthy();
    expect(
      components.children?.find(
        (f) => f.name === "App.tsx" && f.type === "file"
      )
    ).toBeTruthy();
    // Old file should be gone
    expect(src.children?.find((f) => f.name === "index.ts")).toBeFalsy();
  });

  it("renames a folder", () => {
    const tree = renameFile(initialTree, "src/lib", "src/utils");
    const src = tree.find((f) => f.name === "src") as FileItem;
    expect(
      src.children?.find((f) => f.name === "utils" && f.type === "folder")
    ).toBeTruthy();
    expect(src.children?.find((f) => f.name === "lib")).toBeFalsy();
  });

  it("deletes a file", () => {
    const tree = deleteFile(initialTree, "src/index.ts");
    const src = tree.find((f) => f.name === "src") as FileItem;
    expect(src.children?.find((f) => f.name === "index.ts")).toBeFalsy();
  });

  it("deletes a folder recursively", () => {
    const tree = deleteFile(initialTree, "src/lib");
    const src = tree.find((f) => f.name === "src") as FileItem;
    expect(src.children?.find((f) => f.name === "lib")).toBeFalsy();
  });

  it("does nothing if deleting non-existent file", () => {
    const tree = deleteFile(initialTree, "notfound.txt");
    expect(tree).toEqual(initialTree);
  });

  it("does nothing if renaming non-existent file", () => {
    const tree = renameFile(initialTree, "notfound.txt", "foo.txt");
    expect(tree).toEqual(initialTree);
  });

  it("overwrites file if renaming to existing file path", () => {
    const tree = renameFile(initialTree, "README.md", "src/index.ts");
    const src = tree.find((f) => f.name === "src") as FileItem;
    expect(
      src.children?.find((f) => f.name === "index.ts" && f.type === "file")
    ).toBeTruthy();
    expect(tree.find((f) => f.name === "README.md")).toBeFalsy();
  });
});
