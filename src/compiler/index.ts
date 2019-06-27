import {
  OpenAPIObject,
  PathItemObject,
} from "openapi3-ts";
import CompiledPath from "./CompiledPath";
import * as deref from "json-schema-deref-sync";
import { ChowOptions } from "..";

export interface RequestMeta {
  method: string;
  query?: any;
  header?: any;
  path?: any;
  cookie?: any;
  body?: any;
  operationId?: string;
}

export interface ResponseMeta {
  method: string;
  status: number;
  header?: any;
  body?: any;
}

export default function compile(oas: OpenAPIObject, options: Partial<ChowOptions>): CompiledPath[] {
  const document: OpenAPIObject = deref(oas, {failOnMissing: true});

  return Object.keys(document.paths).map((path: string) => {
    const pathItemObject: PathItemObject = document.paths[path];

    // TODO: support for base path
    return new CompiledPath(path, pathItemObject, options);
  });
}
