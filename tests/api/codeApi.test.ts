// Usando Vitest y React Testing Library
import { beforeAll, describe, expect, it } from "vitest";
import { executeCode, resetBd } from "../../src/services/codeApi";
describe("test Api", () => {
  beforeAll(async () => {
    await resetBd();
  });
  let fileId = -1;
  it("runCodde /code", async () => {
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
  // it("runCode with compilations fails /code", async () => {
  //   const code = "1 + '1'";
  //   const response = await executeCode(code);
  //   // Check if the response is not undefined
  //   expect(response).toBeDefined();

  //   if (response && "error" in response) {
  //     expect(response.error.errorCode).toBe(
  //       "TypeError: Error at line 1 in '+' operation, Incompatible types: Integer, String were found but Integer, Integer were expected"
  //     );
  //     expect(response.error.line).toBe(1);
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("insertContent /insertContent/:id", async () => {
  //   const fileName = "Test";
  //   const file: insertCodeProps = { name: fileName };

  //   const response = await createFile(file);
  //   if (response && "message" in response) {
  //     const content: insertContentProps = {
  //       id: response.message,
  //       content: "1+1",
  //     };
  //     const responseContent = await saveCodeFile(content);

  //     expect(responseContent).toBeDefined();

  //     if (responseContent && "message" in responseContent) {
  //       expect(responseContent.message).toBe("Content saved successfully");
  //     } else {
  //       expect(false).toBe(true);
  //     }
  //   }
  // });

  // it("getCodeFiles /file/:id", async () => {
  //   const response = await getCodeFiles();
  //   const files = {
  //     children: [
  //       {
  //         content: "1+1",
  //         name: "Test",
  //         type: "File",
  //       },
  //     ],
  //     name: "Root",
  //     type: "Directory",
  //   };
  //   if (response?.message && files.children) {
  //     expect(response.message.name).toBe(files.name);
  //     expect(response.message.type).toBe(files.type);
  //     if (response.message.children && response.message.children.length > 0) {
  //       const firstChild = response.message.children[0];
  //       const expectedChild = files.children[0];
  //       // Check if the first child is of type CodeProps
  //       if ("content" in firstChild && "content" in expectedChild) {
  //         expect(firstChild.content).toBe(expectedChild.content);
  //         expect(firstChild.name).toBe(expectedChild.name);
  //         expect(firstChild.type).toBe(expectedChild.type);
  //         if (firstChild.id) fileId = firstChild.id;
  //       }
  //     } else {
  //       expect(false).toBe(true);
  //     }
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("getCodeFilesById /file/:id/:fileId", async () => {
  //   const expectedFile: insertCodeProps = {
  //     content: "1+1",
  //     name: "Test",
  //   };
  //   const response = await getFileById(fileId);
  //   if (response && "message" in response) {
  //     expect(response.message.content).toBe(expectedFile.content);
  //     expect(response.message.name).toBe(expectedFile.name);
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("getCodeFilesById with a not existing id /file/:id/:fileId", async () => {
  //   const fileId = -142;

  //   const response = await getFileById(fileId);
  //   if (response && "error" in response) {
  //     expect(response.error).toStrictEqual("File not found");
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("editFile /editFile/:id", async () => {
  //   const file: editCodeProps = {
  //     content: "1+1",
  //     id: fileId,
  //     name: "Test42",
  //     type: "File",
  //   };

  //   const response = await editFile(file);
  //   if (response && "message" in response) {
  //     expect(response.message).toBe("File name updated successfully");
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("editFile with no existing file /editFile/:id", async () => {
  //   const file: editCodeProps = {
  //     content: "1+1",
  //     id: -142,
  //     name: "Test",
  //   };

  //   const response = await editFile(file);
  //   if (response && "error" in response) {
  //     expect(response.error).toStrictEqual("File not found");
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("deleteFile /deleteFile", async () => {
  //   const fileName = "Test2";
  //   const file: insertCodeProps = { name: fileName };
  //   const responseCreate = await createFile(file);

  //   if (responseCreate && "message" in responseCreate) {
  //     const response = await deleteFile(responseCreate.message);
  //     if (response && "message" in response) {
  //       expect(response.message).toBe("File was deleted successfully");
  //     } else {
  //       expect(false).toBe(true);
  //     }
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("deleteFile by not existing id /deleteFile", async () => {
  //   const response = await deleteFile(-1);

  //   // Check if the response is not null
  //   expect(response).not.toBeNull();

  //   // Check for 204 No Content status code
  //   if (response && "status" in response) {
  //     expect(response.status).toBe(204);
  //   }
  // });
  // it("editDirectory with no existing file /editDirectory/:id", async () => {
  //   const directory: DirectoryProps = {
  //     name: "code2",
  //     id: -142,
  //     parentId: 2,
  //     children: [],
  //     type: "Directory",
  //   };

  //   const response = await editDirectory(directory);
  //   if (response && "error" in response) {
  //     expect(response.error).toStrictEqual("File not found");
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("createDirectory /createDirectory/:id", async () => {
  //   const directoryName = "Code2";
  //   const directory: CreateDirectoryProps = { name: directoryName };

  //   const response = await createDirectory(directory);

  //   // Retrieve the files/directories
  //   const files = await getCodeFiles();

  //   if (files?.message.children && "message" in files) {
  //     // Find the newly created directory in the list
  //     const directoryTest2 = files.message.children.find(
  //       (child) => child.type === "Directory" && child.name === directoryName
  //     );

  //     // Check if the directory was created and returned properly
  //     if (response && "message" in response && directoryTest2?.id) {
  //       expect(response.message).toBe(directoryTest2.id);

  //       // Optionally delete the directory if needed
  //       await deleteDirectory(directoryTest2.id);
  //     } else {
  //       expect(true).toBe(false);
  //     }
  //   } else {
  //     expect(true).toBe(false);
  //   }
  // });
  // it("createDirectory a subdirectory /createDirectory/:id", async () => {
  //   const directoryName = "Code2";
  //   const subdirectoryName = "SubDirectory";
  //   const directory: CreateDirectoryProps = { name: directoryName };

  //   const response = await createDirectory(directory);
  //   if (response && "message" in response) {
  //     const subdirectory: CreateDirectoryProps = {
  //       name: subdirectoryName,
  //       parentId: response.message,
  //     };
  //     const subdirectoryResponse = await createDirectory(subdirectory);

  //     // Retrieve the files/directories
  //     const files = await getCodeFiles();
  //     const code2 = files?.message.children;
  //     if (code2 && code2.length > 1 && "children" in code2[1]) {
  //       const directoryTest2 = code2?.[1]?.children?.find(
  //         (child) =>
  //           child.type === "Directory" && child.name === subdirectoryName
  //       );
  //       // Check if the directory was created and returned properly
  //       if (
  //         subdirectoryResponse &&
  //         "message" in subdirectoryResponse &&
  //         directoryTest2?.id
  //       ) {
  //         if ("parentId" in directoryTest2)
  //           expect(response.message).toBe(directoryTest2.parentId);
  //         await deleteDirectory(response.message);
  //         await deleteDirectory(subdirectoryResponse.message);
  //       } else {
  //         expect(true).toBe(false);
  //       }
  //     } else {
  //       expect(true).toBe(false);
  //     }
  //   }
  // });
  // it("createFile/createFile/:id", async () => {
  //   const usrId: Id = 1;
  //   const fileName = "Code2";
  //   const file: insertCodeProps = { name: fileName };

  //   const response = await createFile(file);

  //   // Retrieve the files/directories
  //   const files = await getCodeFiles();

  //   if (files?.message.children && "message" in files) {
  //     // Find the newly created directory in the list
  //     const fileTest2 = files.message.children.find(
  //       (child) => child.type === "File" && child.name === fileName
  //     );

  //     // Check if the directory was created and returned properly
  //     if (response && "message" in response && fileTest2?.id) {
  //       expect(response.message).toBe(fileTest2.id);

  //       // Optionally delete the directory if needed
  //       await deleteDirectory(fileTest2.id);
  //     } else {
  //       expect(true).toBe(false);
  //     }
  //   } else {
  //     expect(true).toBe(false);
  //   }
  // });
  // it("insertContent with an emptyName /createFile/:id", async () => {
  //   const file: insertCodeProps = { name: "" };
  //   const response = await createFile(file);

  //   // Check if the response is undefined
  //   expect(response).toBeDefined();

  //   if (response && "error" in response) {
  //     expect(response.error).toBe("The name of the file can't be empty.");
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("editDirectory with no existing file /editDirectory/:id", async () => {
  //   const directory: DirectoryProps = {
  //     name: "code2",
  //     id: -142,
  //     parentId: 2,
  //     children: [],
  //     type: "Directory",
  //   };

  //   const response = await editDirectory(directory);
  //   if (response && "error" in response) {
  //     expect(response.error).toStrictEqual("File not found");
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("deleteDirectory /deleteDirectory", async () => {
  //   const directoryName = "code2";
  //   const directory: CreateDirectoryProps = { name: directoryName };
  //   const responseInsert = await createDirectory(directory);

  //   expect(responseInsert).toBeDefined();

  //   if (responseInsert && "message" in responseInsert) {
  //     const response = await deleteDirectory(responseInsert.message);
  //     if (response && "message" in response) {
  //       expect(response.message).toBe("Directory was deleted successfully");
  //     }
  //   } else {
  //     expect(false).toBe(true);
  //   }
  // });
  // it("deleteDirectory by not existing id /deleteDirectory", async () => {
  //   const response = await deleteDirectory(-1);

  //   // Check if the response is not null
  //   expect(response).not.toBeNull();

  //   // Check for 204 No Content status code
  //   if (response && "status" in response) {
  //     expect(response.status).toBe(204);
  //   }
  // });
});
