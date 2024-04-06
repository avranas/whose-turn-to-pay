import { HttpError, Property } from "../types";

export function createError(status: number, message: string): HttpError {
  return { status, message };
}

// Returns an error as a string. If there is no error, the string will be empty
export function validateObj(obj: any, expected: Array<Property>): string {
  const errors: Array<string> = [];
  expected.forEach((p) => {
    if (!(p.key in obj)) {
      errors.push('"' + p.key + '" is missing');
      return;
    }
    if (typeof obj[p.key] !== p.type) {
      errors.push('"' + p.key + '" must be a ' + p.type);
    }
  });
  return errors.join("; ");
}

// Takes an array of objects, and compares with one expected property
// Returns an error as a string. If there is no error, the string will be empty
export function batchValidateObj(
  arr: Array<any>,
  key: string,
  expected: Array<Property>,
): string {
  let errors: Array<string> = [];
  if (!arr || !Array.isArray(arr)) {
    let message = '"' + key + '" is missing or not an array. It must contain';
    expected.forEach((e) => {
      message = message.concat(
        ' a key: "' + e.key + '" of type: "' + e.type + '";',
      );
    });
    errors.push(message);
    return errors.join("; ");
  }
  arr.forEach((obj, i) => {
    const error = validateObj(obj, expected);
    if (error !== "") {
      errors = errors.concat("In index #" + i + ": " + error);
    }
  });
  return errors.join("; ");
}
