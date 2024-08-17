import { HttpResponse, http } from "msw";

export const handlers = [
  http.post("/posts", async () => {
    return HttpResponse.json({
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];
