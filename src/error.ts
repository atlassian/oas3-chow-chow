export interface ChowErrorMeta {
  in: string;
  name?: string;
  rawErrors?: string[];
  code?: number;
}

export default class ChowError extends Error {
  private meta: ChowErrorMeta;

  constructor(message: string, meta: ChowErrorMeta) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Custom debugging information
    this.meta = meta;
  }

  public toJSON() {
    return {
      code: this.meta.code || 400,
      location: {
        in: this.meta.in,
        name: this.meta.name || ''
      },
      message: this.message,
      rawErrors: this.meta.rawErrors || []
    }
  }
}
