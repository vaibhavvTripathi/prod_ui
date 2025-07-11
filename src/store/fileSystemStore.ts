import { create } from "zustand";
import { FileItem } from "@/types/file";
import { Step, StepType } from "@/types/steps";
import { useEffect } from "react";
import { useTemplateQuery } from "@/hooks/useTemplateQuery";

// Helper functions for file tree operations (stubs for now)
export function createOrUpdateFile(
  tree: FileItem[],
  filePath: string,
  content: string
): FileItem[] {
  const parts = filePath.split("/").filter(Boolean);
  if (parts.length === 0) return tree;

  function helper(items: FileItem[], idx: number): FileItem[] {
    const name = parts[idx];
    const isFile = idx === parts.length - 1;
    const existingIdx = items.findIndex((item) => item.name === name);
    if (isFile) {
      // Create or update file
      if (existingIdx !== -1) {
        // Update file
        return [
          ...items.slice(0, existingIdx),
          { ...items[existingIdx], type: "file", content, path: parts.slice(0, idx + 1).join("/") },
          ...items.slice(existingIdx + 1),
        ];
      } else {
        // Create file
        return [
          ...items,
          { name, type: "file", content, path: parts.slice(0, idx + 1).join("/") },
        ];
      }
    } else {
      // Folder
      let children: FileItem[] = [];
      if (existingIdx !== -1 && items[existingIdx].type === "folder") {
        children = items[existingIdx].children || [];
      }
      const updatedChildren = helper(children, idx + 1);
      if (existingIdx !== -1 && items[existingIdx].type === "folder") {
        // Update existing folder
        return [
          ...items.slice(0, existingIdx),
          { ...items[existingIdx], children: updatedChildren },
          ...items.slice(existingIdx + 1),
        ];
      } else {
        // Create new folder
        return [
          ...items,
          {
            name,
            type: "folder",
            children: updatedChildren,
            path: parts.slice(0, idx + 1).join("/"),
          },
        ];
      }
    }
  }

  return helper(tree, 0);
}

export function renameFile(
  tree: FileItem[],
  oldPath: string,
  newPath: string
): FileItem[] {
  // Remove the file/folder from oldPath and insert it at newPath
  let target: FileItem | null = null;
  function remove(items: FileItem[], parts: string[], idx: number): FileItem[] {
    if (idx === parts.length - 1) {
      const i = items.findIndex((item) => item.name === parts[idx]);
      if (i !== -1) {
        target = items[i];
        return [...items.slice(0, i), ...items.slice(i + 1)];
      }
      return items;
    } else {
      const i = items.findIndex((item) => item.name === parts[idx] && item.type === "folder");
      if (i === -1) return items;
      const updatedChildren = remove(items[i].children || [], parts, idx + 1);
      return [
        ...items.slice(0, i),
        { ...items[i], children: updatedChildren },
        ...items.slice(i + 1),
      ];
    }
  }
  const oldParts = oldPath.split("/").filter(Boolean);
  const treeWithoutTarget = remove(tree, oldParts, 0);
  if (!target) return tree; // nothing to rename
  // Insert at newPath (as file or folder)
  const newParts = newPath.split("/").filter(Boolean);
  function insert(items: FileItem[], idx: number): FileItem[] {
    const name = newParts[idx];
    const isFile = idx === newParts.length - 1;
    const existingIdx = items.findIndex((item) => item.name === name);
    if (isFile) {
      // Insert/replace file or folder
      const newItem = { ...target!, name, path: newParts.slice(0, idx + 1).join("/") };
      if (existingIdx !== -1) {
        return [
          ...items.slice(0, existingIdx),
          newItem,
          ...items.slice(existingIdx + 1),
        ];
      } else {
        return [...items, newItem];
      }
    } else {
      // Folder
      let children: FileItem[] = [];
      if (existingIdx !== -1 && items[existingIdx].type === "folder") {
        children = items[existingIdx].children || [];
      }
      const updatedChildren = insert(children, idx + 1);
      if (existingIdx !== -1 && items[existingIdx].type === "folder") {
        return [
          ...items.slice(0, existingIdx),
          { ...items[existingIdx], children: updatedChildren },
          ...items.slice(existingIdx + 1),
        ];
      } else {
        return [
          ...items,
          {
            name,
            type: "folder",
            children: updatedChildren,
            path: newParts.slice(0, idx + 1).join("/"),
          },
        ];
      }
    }
  }
  return insert(treeWithoutTarget, 0);
}

export function deleteFile(tree: FileItem[], filePath: string): FileItem[] {
  const parts = filePath.split("/").filter(Boolean);
  function helper(items: FileItem[], idx: number): FileItem[] {
    if (idx === parts.length - 1) {
      const i = items.findIndex((item) => item.name === parts[idx]);
      if (i !== -1) {
        return [...items.slice(0, i), ...items.slice(i + 1)];
      }
      return items;
    } else {
      const i = items.findIndex((item) => item.name === parts[idx] && item.type === "folder");
      if (i === -1) return items;
      const updatedChildren = helper(items[i].children || [], idx + 1);
      return [
        ...items.slice(0, i),
        { ...items[i], children: updatedChildren },
        ...items.slice(i + 1),
      ];
    }
  }
  return helper(tree, 0);
}

function applyStepToTree(tree: FileItem[], step: Step): FileItem[] {
  switch (step.type) {
    case StepType.CreateOrUpdateFile:
      return createOrUpdateFile(tree, step.filePath!, step.content!);
    case StepType.RenameFile:
      return renameFile(tree, step.filePath!, step.newPath!);
    case StepType.DeleteFile:
      return deleteFile(tree, step.filePath!);
    default:
      return tree;
  }
}

type FileSystemState = {
  fileTree: FileItem[];
  setFileTree: (tree: FileItem[]) => void;
  applySteps: (steps: Step[]) => void;
};

const useFileSystemStore = create<FileSystemState>((set) => ({
  fileTree: [],
  setFileTree: (tree) => set({ fileTree: tree }),
  applySteps: (steps) =>
    set((state) => {
      let newTree = [...state.fileTree];
      for (const step of steps) {
        newTree = applyStepToTree(newTree, step);
      }
      return { fileTree: newTree };
    }),
}));

// Custom hook to load initial data from useTemplateQuery and set in Zustand
export function useFileSystemWithTemplate(promptId : number) {
  const { data, isLoading, error } = useTemplateQuery(promptId);
  const setFileTree = useFileSystemStore((state) => state.setFileTree);

  useEffect(() => {
    if (data) {
      setFileTree(data);
    }
  }, [data, setFileTree]);

  return {
    fileTree: useFileSystemStore((s) => s.fileTree),
    applySteps: useFileSystemStore((s) => s.applySteps),
    isLoading,
    error,
  };
}
