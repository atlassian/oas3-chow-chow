import * as Ajv from 'ajv';

const options: Ajv.Options = {
  /**
   * Ignore following formats for now because they are not supported by AJV by default.
   * TODO: Add custom format supports for following formats.
   */
  unknownFormats: [ 'int32', 'int64', 'float', 'double', 'byte', 'binary', 'password' ],
  jsonPointers: true,
}

const ajv = new Ajv(options);
export default ajv;
