export default class ChowError extends Error {
  private where?: string;
  private key?: string;

  constructor(where?: string, key?: string, message?: string) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super();

    // Custom debugging information
    this.where = where;
    this.key = key;
    if (where && key) {
      this.message = `Parameter [${key}] in ${where} ${message}`;
    } else if (where) {
      this.message = `In ${where} ${message}`;
    } else {
      this.message = message || 'Unknown error';
    }
  }
}
