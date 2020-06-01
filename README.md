# oas3-chow-chow

> Request and response validator against OpenAPI Specification

[![Build Status](https://travis-ci.org/atlassian/oas3-chow-chow.svg?branch=master)](https://travis-ci.org/atlassian/oas3-chow-chow)
[![npm](https://img.shields.io/npm/v/oas3-chow-chow.svg?style=flat)](https://www.npmjs.com/package/oas3-chow-chow)

## Notes

If you are looking for framework specific middleware, you might want to look at following libraries that use oas3-chow-chow under the hood.

[koa-oas3](https://github.com/atlassian/koa-oas3)
[openapi3-middleware](https://github.com/naugtur/openapi3-middleware)

## Installation

```bash
$ yarn add oas3-chow-chow
$ # Or
$ npm i oas3-chow-chow
```

## Usage

```typescript
import ChowChow from "oas3-chow-chow";
import * as fs from "fs";
import * as yaml from "js-yaml";

var doc = yaml.safeLoad(fs.readFileSync("./openapi.yml", "utf8"));
const chow = new ChowChow(doc);

// For URL: /:pathParam/info?arrParam=x&arrParam=y&other=z
chow.validateRequestByPath(
  // url.pathname,
  "/books/info",
  "POST", {
    path: { pathParam: "books" },
    // query: querystring.parse(url.search.substr(1)),
    query: { arrParam: ["x", "y"], other: "z" },
    // header: req.headers,
    header: { "Content-Type": "application/json" },
    body: { a: 1, b: 2 },
  }
);
chow.validateResponseByPath("/books/info", "POST", {
  header: { "Content-Type": "application/json" },
  body: {
    name: "a nice book",
    author: "me me me"
  }
});
```

## Config

You could optionally provide configs to the constructor
```typescript
const chow = new ChowChow(doc, {
  headerAjvOptions: {},
  cookieAjvOptions: {},
  pathAjvOptions: { coerceTypes: true },
  queryAjvOptions: { coerceTypes: 'array' },
  requestBodyAjvOptions: {},
  responseBodyAjvOptions: {},
});
```

* **headerAjvOptions**: Ajv options that pass to header ajv instance
* **cookieAjvOptions**: Ajv options that pass to cookie ajv instance
* **pathAjvOptions**: Ajv options that pass to path ajv instance, default `{ coerceTypes: true }`
* **queryAjvOptions**: Ajv options that pass to query ajv instance, default `{ coerceTypes: 'array' }`
* **requestBodyAjvOptions**: Ajv options that pass to request body ajv instance
* **responseBodyAjvOptions**: Ajv options that pass to response body ajv instance

## Contributors

Pull requests, issues and comments welcome. For pull requests:

* Add tests for new features and bug fixes
* Follow the existing style
* Separate unrelated changes into multiple pull requests
* See the existing issues for things to start contributing.

For bigger changes, make sure you start a discussion first by creating an issue and explaining the intended change.

Atlassian requires contributors to sign a Contributor License Agreement, known as a CLA. This serves as a record stating that the contributor is entitled to contribute the code/documentation/translation to the project and is willing to have it used in distributions and derivative works (or is willing to transfer ownership).

Prior to accepting your contributions we ask that you please follow the appropriate link below to digitally sign the CLA. The Corporate CLA is for those who are contributing as a member of an organization and the individual CLA is for those contributing as an individual.

* [CLA for corporate contributors](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=e1c17c66-ca4d-4aab-a953-2c231af4a20b)
* [CLA for individuals](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=3f94fbdc-2fbe-46ac-b14c-5d152700ae5d)
