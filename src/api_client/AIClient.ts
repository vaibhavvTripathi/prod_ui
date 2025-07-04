import axios from "axios";
import { config } from "@/lib/config";
import { FileItem } from "@/types/file";

export async function fetchTemplate(): Promise<FileItem[]> {
  const res = await axios.get<FileItem[]>(`${config.baseUrl}/template`);
  return res.data;
}
