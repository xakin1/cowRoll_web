import { cookiesEnabled } from "../utils/functions/utils";
import type {
  CreateDirectoryProps,
  CreateFileProps,
  DirectoryProps,
  EditFileProps,
  FetchError,
  FetchInsertContent,
  FetchRun,
  FetchSuccess,
  FileProps,
  Id,
  editDirectoryProps,
} from "../utils/types/ApiTypes";

const apiUrl =
  import.meta.env.MODE === "test"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.PUBLIC_API_URL;

export async function getFiles(): Promise<FetchSuccess<DirectoryProps>> {
  const response = await fetch(apiUrl + "api/file/", {
    method: "GET",
    headers: getHeaders(),
    credentials: "include",
  });
  if (response.ok) {
    return await response.json();
  } else {
    console.error("Failed to get the documents.");
    throw new Error("Failed to fetch the files due to an error.");
  }
}

export async function editFile(
  file: EditFileProps
): Promise<FetchSuccess<FileProps> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/file/edit", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(file),
  });
  return await response.json();
}

export async function getFileById(
  fileId: Id
): Promise<FetchSuccess<FileProps> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/file/" + fileId, {
    method: "GET",
    headers: getHeaders(),
    credentials: "include",
  });
  return await response.json();
}

export async function createFile(
  file: CreateFileProps
): Promise<FetchSuccess<Id> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/file/create", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(file),
  });
  return await response.json();
}

export async function saveFile(
  file: EditFileProps
): Promise<FetchInsertContent<string>> {
  try {
    const response = await fetch(apiUrl + "api/file/save", {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(file),
    });
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

export async function deleteFile(
  fileId: Id
): Promise<FetchSuccess<string> | Response | undefined> {
  const response = await fetch(apiUrl + "api/file/delete/" + fileId, {
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

export async function createDirectory(
  directory: CreateDirectoryProps
): Promise<FetchSuccess<Id> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/directory/create", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(directory),
  });
  return await response.json();
}

export async function editDirectory(
  directory: editDirectoryProps
): Promise<FetchSuccess<DirectoryProps> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/directory/edit", {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(directory),
  });
  return await response.json();
}

export async function executeCode(code: string): Promise<FetchRun<any>> {
  try {
    const response = await fetch(apiUrl + "api/code/run", {
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

export async function deleteDirectory(
  directoryId: Id
): Promise<FetchSuccess<string> | Response | undefined> {
  const response = await fetch(apiUrl + "api/directory/delete/" + directoryId, {
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
