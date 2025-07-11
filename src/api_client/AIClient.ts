import axios from "axios";
import { config } from "@/lib/config";
import { FileItem } from "@/types/file";
import { CredentialResponse } from "@react-oauth/google";
import { User } from "@/types/user";
import { Message } from "@/types/message";

export async function fetchTemplate(
  promptId: number,
  token: string
): Promise<FileItem[]> {
  const res = await axios.get<FileItem[]>(
    `${config.baseUrl}/template?promptId=${promptId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

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

export async function addMessage(
  promptId: number,
  message: string,
  role: "user" | "model",
  token: string
) {
  const res = await axios.post(
    "http://localhost:6969/api/v0.1/message/add",
    { promptId, message, role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function getMessagesForPrompt(promptId: number, token: string) {
  const res = await axios.get("http://localhost:6969/api/v0.1/message/get", {
    params: { promptId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.messages as Message[];
}

export async function streamAIChat(
  message: string,
  promptId: number,
  token: string,
  onChunk: (chunk: string) => void
) {
  const res = await fetch("http://localhost:6969/api/v0.1/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, promptId }),
  });

  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let done = false;
  while (!done) {
    const result = await reader.read();
    done = result.done;
    if (result.value) {
      const chunk = decoder.decode(result.value, { stream: true });
      onChunk(chunk);
    }
  }
}
