import * as Ajv from 'ajv';

const options: Ajv.Options = {
  /**
   * Ignore following formats for now because they are not supported by AJV by default.
   * TODO: Add custom format supports for following formats.
   */
  unknownFormats: [ 'int32', 'int64', 'float', 'double', 'byte', 'binary', 'password' ],
  nullable: true,
  jsonPointers: true
}

export default function ajv(opts: Ajv.Options = {}) {
  return new Ajv({
    ...options,
    ...opts
  })
}
