export interface Step {
  type: StepType;
  filePath?: string;
  newPath?: string;
  dependency?: string;
  version?: string;
  content?: string;
}
export enum StepType {
  CreateOrUpdateFile = "CreateOrUpdateFile",
  RenameFile = "RenameFile",
  DeleteFile = "DeleteFile",
  AddDependency = "AddDependency",
}