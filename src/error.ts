export interface ChowErrorLocation {
  in: string;
  name: string;
  rawErrors?: string[];
}

export default class ChowError extends Error {
  private meta: ChowErrorLocation;

  constructor(message: string, meta: ChowErrorLocation) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Custom debugging information
    this.meta = meta;
  }

  public toJSON() {
    return {
      location: {
        in: this.meta.in,
        name: this.meta.name
      },
      message: this.message,
      rawErrors: this.meta.rawErrors || []
    }
  }
}
