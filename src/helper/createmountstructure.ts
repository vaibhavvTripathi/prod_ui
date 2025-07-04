import { FileItem } from "@/types/file";
import { DirectoryNode, FileNode, FileSystemTree } from "@webcontainer/api";

export function convertFileItemArrayToFileSystemTree(fileItems: FileItem[]): FileSystemTree {
    const tree: FileSystemTree = {};
    
    for (const item of fileItems) {
      convertFileItemToTree(item, tree);
    }
    
    return tree;
  }
  
  function convertFileItemToTree(item: FileItem, tree: FileSystemTree): void {
    if (item.type === "folder") {
      // Create directory node
      const directoryNode: DirectoryNode = {
        directory: {}
      };
      
      // Process children if they exist
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          convertFileItemToTree(child, directoryNode.directory);
        }
      }
      
      tree[item.name] = directoryNode;
    } else if (item.type === "file") {
      // Create file node
      const fileNode: FileNode = {
        file: {
          contents: item.content || ""
        }
      };
      
      tree[item.name] = fileNode;
    }
  }