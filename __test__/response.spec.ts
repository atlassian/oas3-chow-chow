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

  it('should fail on unsupported response media type', () => {
    expect(() => {
      chowchow.validateResponse("/pets/123", {
        method: "get",
        status: 200,
        header: {
          "content-type": "application/nonono"
        }
      });
    }).toThrow();
  })

  it('should fail if response body is invalid', () => {
    expect(() => {
      chowchow.validateResponse("/pets/123", {
        method: "get",
        status: 200,
        header: {
          "content-type": "application/json"
        },
        body: [
          {
            id: 1
          }
        ]
      });
    }).toThrow();
  })

  it('should fail if response code does not match any', () => {
    expect(() => {
      chowchow.validateResponse("/no-default", {
        method: "get",
        status: 400,
        header: {
          "content-type": "application/json"
        }
      });
    }).toThrow();
  })

  it('should fail if response method is invalid', () => {
    expect(() => {
      chowchow.validateResponse("/no-default", {
        method: "path",
        status: 400,
        header: {
          "content-type": "application/json"
        }
      });
    }).toThrow();
  })

  it('should fail if header is invalid', () => {
    expect(() => {
      chowchow.validateResponse("/header", {
        method: "get",
        status: 200,
        header: {
          "content-type": "application/json",
          "version": [1, 2]
        }
      });
    }).toThrow();
  })

  it('should fail if required header is empty', () => {
    expect(() => {
      chowchow.validateResponse("/header", {
        method: "get",
        status: 200
      });
    }).toThrow();
  })
});
