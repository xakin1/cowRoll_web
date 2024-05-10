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

export async function getFiles(
  userId: number
): Promise<FetchSuccess<DirectoryProps> | undefined> {
  const response = await fetch(apiUrl + "api/file/" + userId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    console.error("Failed to get the documents.");
  }
}

export async function getFileById(
  userId: number,
  fileId: number
): Promise<FetchSuccess<FileProps> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/file/" + userId + "/" + fileId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}
export async function editFile(
  userId: number,
  file: editFileProps
): Promise<FetchSuccess<FileProps> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/editFile/" + userId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(file),
  });
  return await response.json();
}

export async function createDirectory(
  userId: number,
  directory: insertDirectoryProps
): Promise<FetchSuccess<Id> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/createDirectory/" + userId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(directory),
  });
  return await response.json();
}
export async function createFile(
  userId: number,
  file: insertFileProps
): Promise<FetchSuccess<Id> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/createFile/" + userId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(file),
  });
  return await response.json();
}

export async function editDirectory(
  userId: number,
  directory: editDirectoryProps
): Promise<FetchSuccess<DirectoryProps> | FetchError | undefined> {
  const response = await fetch(apiUrl + "api/editDirectory/" + userId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(directory),
  });
  return await response.json();
}

export async function executeCode(code: string): Promise<FetchRun<any>> {
  try {
    const response = await fetch(apiUrl + "api/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  userId: number,
  file: any
): Promise<FetchInsertContent<string>> {
  try {
    const response = await fetch(apiUrl + "api/insertContent/" + userId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

export async function saveContent(
  userId: number,
  file: FileProps
): Promise<FetchInsertContent<string> | undefined> {
  const response = await fetch(apiUrl + "api/editFile/" + userId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(file),
  });
  if (response.ok) {
    return response.json();
  } else {
    console.error("Failed to save the document.");
  }
}
export async function deleteFile(
  userId: number,
  fileId: number
): Promise<FetchSuccess<string> | Response | undefined> {
  const response = await fetch(
    apiUrl + "api/deleteFile/" + userId + "/" + fileId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
  userId: number,
  directoryId: number
): Promise<FetchSuccess<string> | Response | undefined> {
  const response = await fetch(
    apiUrl + "api/deleteDirectory/" + userId + "/" + directoryId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
    headers: {
      "Content-Type": "application/json",
    },
  });
}
