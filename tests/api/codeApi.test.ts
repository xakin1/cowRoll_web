// Usando Vitest y React Testing Library
import { beforeAll, describe, expect, it } from "vitest";
import {
  createDirectory,
  deleteDirectory,
  deleteFile,
  editDirectory,
  editFile,
  executeCode,
  getFileById,
  getFiles,
  insertContent,
  resetBd,
} from "../../src/services/codeApi";
import type {
  DirectoryProps,
  FileProps,
} from "./../../src/utils/types/ApiTypes";
describe("test Api", () => {
  beforeAll(async () => {
    await resetBd();
  });
  let fileId = -1;
  it("runCode /code", async () => {
    const code = "1 +1";
    const response = await executeCode(code);
    // Check if the response is not undefined
    expect(response).toBeDefined();

    if (response && "message" in response) {
      expect(response.message).toBe(2); // Make sure the expected result is a string "2", not number 2
    } else {
      expect(false).toBe(true);
    }
  });
  it("runCode with compilations fails /code", async () => {
    const code = "1 + '1'";
    const response = await executeCode(code);
    // Check if the response is not undefined
    expect(response).toBeDefined();

    if (response && "error" in response) {
      expect(response.error.errorCode).toBe(
        "TypeError: Error at line 1 in '+' operation, Incompatible types: Integer, String were found but Integer, Integer were expected"
      );
      expect(response.error.line).toBe(1);
    } else {
      expect(false).toBe(true);
    }
  });
  it("insertContent /insertContent/:id", async () => {
    const usrId = 1;
    const file: FileProps = { name: "Test", content: "1+1" };
    const response = await insertContent(usrId, file);

    expect(response).toBeDefined();

    if (response && "message" in response) {
      expect(response.message).toBe("Content saved successfully");
    } else {
      expect(false).toBe(true);
    }
  });
  it("insertContent with an emptyName /insertContent/:id", async () => {
    const usrId = 1;
    const file: FileProps = { name: "", content: "1+1" };
    const response = await insertContent(usrId, file);

    // Check if the response is undefined
    expect(response).toBeDefined();

    if (response && "error" in response) {
      expect(response.error).toBe("The name of the file can't be empty.");
    } else {
      expect(false).toBe(true);
    }
  });
  it("getFiles /file/:id", async () => {
    const usrId = 1;
    const response = await getFiles(usrId);
    const files: DirectoryProps = {
      children: [
        {
          content: "1+1",
          name: "Test",
          type: "File",
        },
      ],
      name: "Root",
      type: "Directory",
    };
    if (response?.message && files.children) {
      expect(response.message.name).toBe(files.name);
      expect(response.message.type).toBe(files.type);
      if (response.message.children && response.message.children.length > 0) {
        const firstChild = response.message.children[0];
        const expectedChild = files.children[0];
        // Check if the first child is of type FileProps
        if ("content" in firstChild && "content" in expectedChild) {
          expect(firstChild.content).toBe(expectedChild.content);
          expect(firstChild.name).toBe(expectedChild.name);
          expect(firstChild.type).toBe(expectedChild.type);
          if (firstChild.id) fileId = firstChild.id;
        }
      } else {
        expect(false).toBe(true);
      }
    } else {
      expect(false).toBe(true);
    }
  });
  it("getFilesById /file/:id/:fileId", async () => {
    const usrId = 1;
    const expectedFile: FileProps = {
      content: "1+1",
      name: "Test",
    };
    const response = await getFileById(usrId, fileId);
    if (response && "message" in response) {
      expect(response.message.content).toBe(expectedFile.content);
      expect(response.message.name).toBe(expectedFile.name);
    } else {
      expect(false).toBe(true);
    }
  });
  it("getFilesById with a not existing id /file/:id/:fileId", async () => {
    const fileId = -142;
    const usrId = 1;

    const response = await getFileById(usrId, fileId);
    if (response && "error" in response) {
      expect(response.error).toStrictEqual("File not found");
    } else {
      expect(false).toBe(true);
    }
  });
  it("editFile /editFile/:id", async () => {
    const file: FileProps = {
      content: "1+1",
      id: fileId,
      name: "Test42",
    };

    const usrId = 1;
    const response = await editFile(usrId, file);
    if (response && "message" in response) {
      expect(response.message).toBe("File name updated successfully");
    } else {
      expect(false).toBe(true);
    }
  });
  it("editFile with no existing file /editFile/:id", async () => {
    const file: FileProps = {
      content: "1+1",
      id: -142,
      name: "Test",
    };

    const usrId = 1;
    const response = await editFile(usrId, file);
    if (response && "error" in response) {
      expect(response.error).toStrictEqual("File not found");
    } else {
      expect(false).toBe(true);
    }
  });
  it("deleteFile /deleteFile", async () => {
    const usrId = 1;
    const fileName = "Test2";
    const file: FileProps = { name: fileName, content: "1+1" };
    const responseInsert = await insertContent(usrId, file);

    expect(responseInsert).toBeDefined();

    if (responseInsert && "message" in responseInsert) {
      expect(responseInsert.message).toBe("Content saved successfully");
    } else {
      expect(false).toBe(true);
    }

    const files = await getFiles(usrId);
    if (files && "message" in files) {
      const file_test2 = files.message.children.find(
        (child) => child.type === "File" && child.name === fileName
      );
      if (file_test2?.id != undefined) {
        const response = await deleteFile(usrId, file_test2.id);
        if (response && "message" in response) {
          expect(response.message).toBe("File was deleted successfully");
        } else {
          expect(false).toBe(true);
        }
      }
    } else {
      expect(false).toBe(true);
    }
  });
  it("deleteFile by not existing id /deleteFile", async () => {
    const usrId = 1;
    const response = await deleteFile(usrId, -1);

    // Check if the response is not null
    expect(response).not.toBeNull();

    // Check for 204 No Content status code
    if (response && "status" in response) {
      expect(response.status).toBe(204);
    }
  });

  it("editDirectory with no existing file /editDirectory/:id", async () => {
    const directory: DirectoryProps = {
      name: "code2",
      id: -142,
      parentId: 2,
    };

    const usrId = 1;
    const response = await editDirectory(usrId, directory);
    if (response && "error" in response) {
      expect(response.error).toStrictEqual("File not found");
    } else {
      expect(false).toBe(true);
    }
  });
  it("createDirectory /createDirectory/:id", async () => {
    const usrId = 1;
    const directoryName = "Code2";
    const directory: DirectoryProps = { name: directoryName };

    const response = await createDirectory(usrId, directory);

    // Retrieve the files/directories
    const files = await getFiles(usrId);

    if (files?.message.children && "message" in files) {
      // Find the newly created directory in the list
      const directoryTest2 = files.message.children.find(
        (child) => child.type === "Directory" && child.name === directoryName
      );

      // Check if the directory was created and returned properly
      if (response && "message" in response && directoryTest2?.id) {
        expect(response.message).toBe(directoryTest2.id);

        // Optionally delete the directory if needed
        await deleteDirectory(usrId, directoryTest2.id);
      } else {
        expect(true).toBe(false);
      }
    } else {
      expect(true).toBe(false);
    }
  });

  it("createDirectory a subdirectory /createDirectory/:id", async () => {
    const usrId = 1;
    const directoryName = "Code2";
    const subdirectoryName = "SubDirectory";
    const directory: DirectoryProps = { name: directoryName };

    const response = await createDirectory(usrId, directory);
    if (response && "message" in response) {
      const subdirectory: DirectoryProps = {
        name: subdirectoryName,
        parentId: response.message,
      };
      const subdirectoryResponse = await createDirectory(usrId, subdirectory);

      // Retrieve the files/directories
      const files = await getFiles(usrId);
      const code2 = files?.message.children;
      if (code2 && code2.length > 1 && "children" in code2[1]) {
        const directoryTest2 = code2?.[1]?.children?.find(
          (child) =>
            child.type === "Directory" && child.name === subdirectoryName
        );
        // Check if the directory was created and returned properly
        if (
          subdirectoryResponse &&
          "message" in subdirectoryResponse &&
          directoryTest2?.id
        ) {
          if ("parentId" in directoryTest2)
            expect(response.message).toBe(directoryTest2.parentId);
          await deleteDirectory(usrId, response.message);
          await deleteDirectory(usrId, subdirectoryResponse.message);
        } else {
          expect(true).toBe(false);
        }
      } else {
        expect(true).toBe(false);
      }
    }
  });
  it("editDirectory with no existing file /editDirectory/:id", async () => {
    const directory: DirectoryProps = {
      name: "code2",
      id: -142,
      parentId: 2,
    };

    const usrId = 1;
    const response = await editDirectory(usrId, directory);
    if (response && "error" in response) {
      expect(response.error).toStrictEqual("File not found");
    } else {
      expect(false).toBe(true);
    }
  });
  it("deleteDirectory /deleteDirectory", async () => {
    const usrId = 1;
    const directoryName = "code2";
    const directory = { name: directoryName };
    const responseInsert = await createDirectory(usrId, directory);

    expect(responseInsert).toBeDefined();

    if (responseInsert && "message" in responseInsert) {
      const response = await deleteDirectory(usrId, responseInsert.message);
      if (response && "message" in response) {
        expect(response.message).toBe("Directory was deleted successfully");
      }
    } else {
      expect(false).toBe(true);
    }
  });
  it("deleteDirectory by not existing id /deleteDirectory", async () => {
    const usrId = 1;
    const response = await deleteDirectory(usrId, -1);

    // Check if the response is not null
    expect(response).not.toBeNull();

    // Check for 204 No Content status code
    if (response && "status" in response) {
      expect(response.status).toBe(204);
    }
  });
});
