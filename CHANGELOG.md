# oas3-chow-chow

## 3.0.1

### Patch Changes

- e81f606: handle additional open api keywords

## 3.0.0

### Major Changes

- bf09b6c: The API has been updated to be an async function.
  Remove support for node v14.
- b90c88c: Upgrade ajv to version 8.

  The main BREAKING CHANGE is that the support for JSON-Schema draft-04 is removed from version 8.
  Some properties of Ajv.Options has also changed its shape.
  More details: https://ajv.js.org/v6-to-v8-migration.html

## 2.0.1

### Patch Changes

- 1e25a24: Fix issue with empty response header

## 2.0.0

### Major Changes

- bd2cac7: bump typescript to v4

## 1.2.2

### Patch Changes

- c8fc209: bump better-ajv-errors version

## 1.2.1

### Patch Changes

- 5cc0aeb: Renovate bump dependencies

## 1.2.0

### Minor Changes

- 48fa398: Make response header name validation case-insensitive

## 1.1.4

### Patch Changes

- b99e1f1: Renovate bump dependencies

## 1.1.3

### Patch Changes

- 9b804b4: fix: use responseBodyAjvOptions if passed

## 1.1.2

### Patch Changes

- f0ed23d: fix #45 where validateRequest was mistakenly called in validateResponseByOperationId

## 1.1.1

### Patch Changes

- af69512: Bump avj to 6.12.3

## 1.1.0

### Minor Changes

- 4612f8a: Fixed type of ChowError.meta.rawErrors and updated documentation

### Patch Changes

- 0df9521: Upgrade json-schema-deref-sync

## 1.0.0

### Major Changes

- e7ce361: 💥 Breaking Changes:
  `validateRequest` will now be deprecated in favor of `validateRequestByPath`, but it will NOT break. Instead, it will be printing a deprecated warning message, but do expect it to be removed completely in the future.

  🎁 New Features:
  Adds support for validate by operationId

### Patch Changes

- a833a4c: Fix registry

## 0.18.0

### Minor Changes

- 1edce3e: Add constructor argument "options" (ChowOptions) to CompiledRequestBody. This arg is passed to CompiledSchema and ultimately AJV for validation

### Patch Changes

- 989f29c: Make HTTP header names case-insensitive

## 0.17.0

### Minor Changes

- ab942d4: Support parameter override

## 0.16.3

### Patch Changes

- ef5b0fe: Bump dev pkgs

## 0.16.2

### Patch Changes

- 4ed0b01: bump better-ajv-errors
