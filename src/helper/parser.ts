import { Step, StepType } from "@/types/steps";

export function parseCodexityCodeBlock(code: string): Step[] {
  const steps: Step[] = [];

  const writeRegex =
    /<codexity-write file_path="([^"]+)">\n?([\s\S]*?)<\/codexity-write>/g;
  let match;
  while ((match = writeRegex.exec(code)) !== null) {
    const [, filePath, content] = match;
    steps.push({
      type: StepType.CreateOrUpdateFile,
      filePath,
      content,
    });
  }

  const renameRegex =
    /<codexity-rename original_file_path="([^"]+)" new_file_path="([^"]+)"\s*\/?>/g;

  while ((match = renameRegex.exec(code)) !== null) {
    const [, filePath, newPath] = match;
    steps.push({
      type: StepType.RenameFile,
      filePath,
      newPath,
    });
  }

  const deleteRegex = /<codexity-delete file_path="([^"]+)"\s*\/?>/g;
  while ((match = deleteRegex.exec(code)) !== null) {
    const [, filePath] = match;
    steps.push({
      type: StepType.DeleteFile,
      filePath,
    });
  }

  const depRegex =
    /<codexity-add-dependency>([^@]+)@([^<]+)<\/codexity-add-dependency>/g;
  while ((match = depRegex.exec(code)) !== null) {
    const [, dependency, version] = match;
    steps.push({
      type: StepType.AddDependency,
      dependency,
      version,
    });
  }

  return steps;
}
