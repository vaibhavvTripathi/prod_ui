import axios from "axios";
import { config } from "@/lib/config";
import { FileItem } from "@/types/file";
import { CredentialResponse } from "@react-oauth/google";
import { User } from "@/types/user";

export async function fetchTemplate(): Promise<FileItem[]> {
  const res = await axios.get<FileItem[]>(`${config.baseUrl}/template`);
  return res.data;
}

export const streamChat = async (
  message: string,
  onChunk: (chunk: string) => void
) => {
  const res = await fetch("http://localhost:6969/api/v0.1/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  const read = async () => {
    let done = false;

    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (result.value) {
        const chunk = decoder.decode(result.value, { stream: true });
        onChunk(chunk);
      }
    }
  };

  await read();
};

export async function verifyGoogleLogin(credential: CredentialResponse) {
  const res = await axios.post(
    "http://localhost:6969/api/v0.1/auth/verify-google",
    credential
  );
  return res.data; // { token: string }
}

export async function getUser(token: string): Promise<User> {
  const res = await axios.get("http://localhost:6969/api/v0.1/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as User;
}

export async function upsertPrompt(prompt: string, token: string) {
  const res = await axios.post(
    "http://localhost:6969/api/v0.1/prompt/",
    { prompt },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
