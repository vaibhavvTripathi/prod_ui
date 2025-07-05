import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Editor from "@monaco-editor/react";
import { FileItem } from "@/types/file";

interface CodeEditorProps {
  files: FileItem[];
  className?: string;
  height?: string | number;
  width?: string | number;
}

interface FileTreeItemProps {
  item: FileItem;
  level: number;
  onFileSelect: (item: FileItem) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  selectedFile?: string;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  item,
  level,
  onFileSelect,
  expandedFolders,
  onToggleFolder,
  selectedFile,
}) => {
  const isExpanded = expandedFolders.has(item.path);
  const isSelected = selectedFile === item.path;

  const handleClick = () => {
    if (item.type === "folder") {
      onToggleFolder(item.path);
    } else {
      onFileSelect(item);
    }
  };

  const getFileIcon = () => {
    return <File className="w-4 h-4 text-code-editor-text-muted" />;
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 cursor-pointer transition-colors duration-100 relative",
          "rounded-md",
          isSelected
            ? "bg-muted text-primary font-semibold border-l-4 border-primary dark:bg-muted/60"
            : "hover:bg-muted/40 hover:text-foreground dark:hover:bg-muted/20",
          "text-sm"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {/* Ripple effect */}
        <span className="absolute left-0 top-0 w-full h-full pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-20 bg-blue-300 rounded-lg" />
        {item.type === "folder" && (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-1 text-code-editor-text-muted" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1 text-code-editor-text-muted" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2 text-code-editor-text-muted" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-code-editor-text-muted" />
            )}
          </>
        )}
        {item.type === "file" && <div className="w-4 h-4 mr-1" />}
        {item.type === "file" && <div className="mr-2">{getFileIcon()}</div>}
        <span className="truncate">{item.name}</span>
      </div>

      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CodeEditor: React.FC<CodeEditorProps> = ({ files, className, height, width }) => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [openTabs, setOpenTabs] = useState<FileItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    if (!openTabs.find((tab) => tab.path === file.path)) {
      setOpenTabs((prev) => [...prev, file]);
    }
  };

  const handleTabClose = (file: FileItem) => {
    const newTabs = openTabs.filter((tab) => tab.path !== file.path);
    setOpenTabs(newTabs);

    if (selectedFile?.path === file.path) {
      setSelectedFile(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  const handleTabSelect = (file: FileItem) => {
    setSelectedFile(file);
  };

  const handleToggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getLanguageFromFileName = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      tsx: "typescript",
      ts: "typescript",
      jsx: "javascript",
      js: "javascript",
      css: "css",
      html: "html",
      json: "json",
      md: "markdown",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      xml: "xml",
      yaml: "yaml",
      yml: "yaml",
    };
    return languageMap[extension || ""] || "plaintext";
  };

  return (
    <div
      className={cn(
        "flex bg-muted text-muted-foreground overflow-hidden dark:bg-background dark:text-foreground",
        className
      )}
      style={{
        height: height || "100vh",
        width: width || "100%"
      }}
    >
      {/* Sidebar */}
      <aside className="w-72 h-full bg-popover border-r border-border flex flex-col z-10 dark:bg-popover dark:border-border">
        <div className="flex-1 overflow-y-auto py-2 px-1">
          {files.length === 0 ? (
            <div className="text-center text-muted-foreground mt-8">
              No files found
            </div>
          ) : (
            files.map((file) => (
              <FileTreeItem
                key={file.path}
                item={file}
                level={0}
                onFileSelect={handleFileSelect}
                expandedFolders={expandedFolders}
                onToggleFolder={handleToggleFolder}
                selectedFile={selectedFile?.path}
              />
            ))
          )}
        </div>
      </aside>
      {/* Main Area */}
      <main className="flex-1 flex flex-col relative bg-background p-0 dark:bg-background">
        {/* Tabs */}
        {openTabs.length > 0 && (
          <div className="border-b border-border bg-popover dark:bg-popover overflow-x-auto">
            <div className="flex min-w-full">
              {openTabs.map((tab) => (
                <div
                  key={tab.path}
                  className={cn(
                    "flex items-center px-4 py-2 cursor-pointer text-sm relative group border-b-2 transition-colors duration-150 flex-shrink-0",
                    selectedFile?.path === tab.path
                      ? "border-primary text-primary bg-background dark:bg-background"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 dark:hover:bg-muted/20"
                  )}
                  onClick={() => handleTabSelect(tab)}
                  style={{ minWidth: 120 }}
                >
                  <File className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate max-w-[100px]">{tab.name}</span>
                  <button
                    className="ml-2 hover:text-destructive flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabClose(tab);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Editor */}
        <div className="flex-1 bg-background overflow-hidden border-none dark:bg-background">
          {selectedFile ? (
            <Editor
              height="100%"
              language={getLanguageFromFileName(selectedFile.name)}
              value={selectedFile.content || "// No content available"}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily:
                  'JetBrains Mono, Monaco, Menlo, "Ubuntu Mono", monospace',
                lineNumbers: "on",
                renderWhitespace: "selection",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                smoothScrolling: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">
                  Select a file to view its contents
                </p>
                <p className="text-sm mt-2">
                  Click on any file in the explorer to open it
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CodeEditor;
