import ChowChow from "../src";
import ChowError from "../src/error";
const fixture = require("./fixtures/response.json");

describe("Response", () => {
  let chowchow: ChowChow;

  beforeAll(() => {
    chowchow = new ChowChow(fixture);
  });

  test("It should validate the response with status code", () => {
    expect(() => {
      chowchow.validateResponse("/pets/123", {
        method: "get",
        status: 200,
        header: {
          "content-type": "application/json"
        },
        body: [
          {
            id: 1,
            name: "plum"
          }
        ]
      });
    }).not.toThrow();
  });

  test("It should fall back to default if no status code is matched", () => {
    expect(() => {
      chowchow.validateResponse("/pets/123", {
        method: "get",
        status: 500,
        header: {
          "content-type": "application/json"
        },
        body: [
          {
            code: 500,
            message: "something is wrong"
          }
        ]
      });
    }).not.toThrow();
  });

  test("It should throw error if path parameter fails schema check", () => {
    expect(() => {
      chowchow.validateRequest("/pets/abc", {
        method: "get"
      });
    }).toThrowError(ChowError);
  });
});
