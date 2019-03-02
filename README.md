# oas3-chow-chow

> Request and response validator against OpenAPI Specification

[![Build Status](https://travis-ci.org/atlassian/oas3-chow-chow.svg?branch=master)](https://travis-ci.org/atlassian/oas3-chow-chow)
[![npm](https://img.shields.io/npm/v/oas3-chow-chow.svg?style=flat)](https://www.npmjs.com/package/oas3-chow-chow)

## Notes

If you are looking for framework specific middleware, you might want to look at following libraries that use oas3-chow-chow under the hood.

[koa-oas3](https://github.com/atlassian/koa-oas3)

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

chow.validateRequest("./books", {
  method: "post",
  query: {
    expand: ["document", "author"]
  },
  body: {
    name: "a nice book",
    author: "me me me"
  }
});

chow.validateResponse("./books", {
  method: "post",
  header: {
    "content-type": "application/json"
  },
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
