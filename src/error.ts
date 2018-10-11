export interface ChowErrorMeta {
  in: string;
  rawErrors?: string[];
  code?: number;
}

export default class ChowError extends Error {
  meta: ChowErrorMeta;

  constructor(message: string, meta: ChowErrorMeta) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);
    this.name = this.constructor.name;

    // Custom debugging information
    this.meta = meta;
  }

  public toJSON() {
    return {
      code: this.meta.code || 400,
      location: {
        in: this.meta.in,
      },
      message: this.message,
      suggestions: this.meta.rawErrors || []
    }
  }
}

export class RequestValidationError extends ChowError {
  constructor(message: string, meta: ChowErrorMeta) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(`RequestValidationError: ${message}`, meta);
  }
}
export class ResponseValidationError extends ChowError {
  constructor(message: string, meta: ChowErrorMeta) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(`ResponseValidationError: ${message}`, meta);
  }
}
