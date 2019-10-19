import {
  OpenAPIObject,
  PathItemObject,
} from "openapi3-ts";
import CompiledPath from "./CompiledPath";
import * as deref from "json-schema-deref-sync";
import { ChowOptions } from "..";
import CompiledOperation from "./CompiledOperation";
import { OperationRegisterFunc } from "./CompiledPathItem";

export interface RequestMeta {
  query?: any;
  header?: any;
  path?: any;
  cookie?: any;
  body?: any;
  operationId?: string;
}

export interface ResponseMeta {
  status: number;
  header?: any;
  body?: any;
}

export default function compile(oas: OpenAPIObject, options: Partial<ChowOptions>): { compiledPaths: CompiledPath[], compiledOperationById: Map<string, CompiledOperation> } {
  const document: OpenAPIObject = deref(oas, { failOnMissing: true });

  if (document instanceof Error) {
    throw document;
  }

  const compiledOperationById = new Map<string, CompiledOperation>();
  const registerOperationById: OperationRegisterFunc = (operationId: string, compiledOperation: CompiledOperation) => {
    compiledOperationById.set(operationId, compiledOperation);
  }

  const compiledPaths = Object.keys(document.paths).map((path: string) => {
    const pathItemObject: PathItemObject = document.paths[path];

    // TODO: support for base path
    return new CompiledPath(path, pathItemObject, { ...options, registerCompiledOperationWithId: registerOperationById });
  });

  return {
    compiledPaths,
    compiledOperationById
  };
}
