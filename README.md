# oas3-chow-chow

> Request and response validator against OpenAPI Specification

[![Build Status](https://travis-ci.org/supertong/oas3-chow-chow.svg?branch=master)](https://travis-ci.org/supertong/oas3-chow-chow)
[![npm](https://img.shields.io/npm/v/oas3-chow-chow.svg?style=flat)](https://www.npmjs.com/package/oas3-chow-chow)

## Installation
```bash
$ yarn add oas3-chow-chow
$ # Or
$ npm i oas3-chow-chow
```

## Usage
```typescript
import ChowChow from 'oas3-chow-chow';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

var doc = yaml.safeLoad(fs.readFileSync('./openapi.yml', 'utf8'));
const chow = new ChowChow(doc);

chow.validateRequest('./books', {
  method: 'post',
  query: {
    expand: ['document', 'author']
  },
  body: {
    name: 'a nice book',
    author: 'me me me'
  }
})
```
