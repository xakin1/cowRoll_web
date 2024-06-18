import { cookiesEnabled } from "../utils/functions/utils";
import type {
  DirectoryProps,
  FetchError,
  FetchInsertContent,
  FetchRun,
  FetchSuccess,
  FileProps,
  Id,
  editDirectoryProps,
  editFileProps,
  insertDirectoryProps,
  insertFileProps,
} from "../utils/types/ApiTypes";

const apiUrl =
  import.meta.env.MODE === "test"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.PUBLIC_API_URL;

export async function getFiles(): Promise<
  FetchSuccess<DirectoryProps> | undefined
> {
  const response = await fetch(apiUrl + "api/file", {
    method: "GET",
    headers: getHeaders(),
    credentials: "include",
  });
  if (response.ok) {
    return await response.json();
  } else {
    console.error("Failed to get the documents.");
  }
}

export async function signUp(username: string, password: string) {
  const response = await fetch(apiUrl + "api/signUp/", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign up.");
  }

  const data = await response.json();

  // Usar localStorage solo si las cookies no están habilitadas
  if (!cookiesEnabled() && data.message) {
    localStorage.setItem("jwtToken", data.token);
  }

  return data;
}

export async function login(username: string, password: string) {
  const response = await fetch(apiUrl + "api/login/", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign up.");
  }

  const data = await response.json();

  // Usar localStorage solo si las cookies no están habilitadas
  if (!cookiesEnabled() && data.message) {
    localStorage.setItem("jwtToken", data.token);
  }

  return data;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Only add Authorization header if cookies are not enabled and the token exists
  if (!cookiesEnabled()) {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function getFileById(
  fileId: number
): Promise<FetchSuccess<FileProps> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/file/" + fileId, {
    method: "GET",
    headers: getHeaders(),
    credentials: "include",
  });
  return await response.json();
}

export async function editFile(
  file: editFileProps
): Promise<FetchSuccess<FileProps> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/editFile", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(file),
  });
  return await response.json();
}

export async function createDirectory(
  directory: insertDirectoryProps
): Promise<FetchSuccess<Id> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/createDirectory", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(directory),
  });
  return await response.json();
}

export async function createFile(
  file: insertFileProps
): Promise<FetchSuccess<Id> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/createFile", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(file),
  });
  return await response.json();
}

export async function editDirectory(
  directory: editDirectoryProps
): Promise<FetchSuccess<DirectoryProps> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/editDirectory", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(directory),
  });
  return await response.json();
}

export async function executeCode(code: string): Promise<FetchRun<any>> {
  try {
    const response = await fetch(apiUrl + "api/code", {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ content: code }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to execute the document.");
    }
  } catch (error: any) {
    console.error("Execution error:", error);
    return { error: { error: "", errorCode: error.toString() } };
  }
}

export async function insertContent(
  file: FileProps
): Promise<FetchInsertContent<string>> {
  try {
    const response = await fetch(apiUrl + "api/insertContent", {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(file),
    });
    console.log(file);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to save the document.");
    }
  } catch (error) {
    console.error("Network or other error", error);
    return undefined;
  }
}

export async function saveContent(
  file: FileProps
): Promise<FetchInsertContent<string> | undefined> {
  const response = await fetch(apiUrl + "api/editFile", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(file),
  });
  console.log(file);

  if (response.ok) {
    return response.json();
  } else {
    console.error("Failed to save the document.");
  }
}

export async function deleteFile(
  fileId: number
): Promise<FetchSuccess<string> | Response | undefined> {
  const response = await fetch(apiUrl + "api/deleteFile/" + fileId, {
    method: "DELETE",
    headers: getHeaders(),
    credentials: "include",
  });
  if (response.ok) {
    if (response.status == 204) {
      return response;
    } else {
      return await response.json();
    }
  } else {
    console.error("Failed to delete the document.");
  }
}

export async function deleteDirectory(
  directoryId: number
): Promise<FetchSuccess<string> | Response | undefined> {
  const response = await fetch(apiUrl + "api/deleteDirectory/" + directoryId, {
    method: "DELETE",
    headers: getHeaders(),
    credentials: "include",
  });
  if (response.ok) {
    if (response.status == 204) {
      return response;
    } else {
      return await response.json();
    }
  } else {
    console.error("Failed to save the document.");
  }
}

export async function resetBd() {
  await fetch(apiUrl + "test/reset", {
    method: "DELETE",
    headers: getHeaders(),
    credentials: "include",
  });
}
