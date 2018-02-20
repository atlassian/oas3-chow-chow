import { OpenAPIObject, PathObject, PathItemObject, OperationObject } from 'openapi3-ts';
import CompiledPath from './CompiledPath';

export interface RequestMeta {
  method: string;
  query?: any;
  header?: any;
  path?: any;
  cookie?: any;
  body?: any;
}

export default function compile(oas: OpenAPIObject): CompiledPath[] {
  // TODO: Shall I deref the document here?

  return Object.keys(oas.paths).map((path: string) => {
    const pathItemObject: PathItemObject = oas.paths[path];

    // TODO: support for base path
    return new CompiledPath(
      path,
      new RegExp('^'+  path.replace(/\{[^}]*}/g, '[^/]+') + '/?$'),
      pathItemObject
    );
  });
}
