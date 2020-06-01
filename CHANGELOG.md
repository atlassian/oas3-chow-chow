# oas3-chow-chow

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
