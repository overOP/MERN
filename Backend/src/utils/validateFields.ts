import { Response } from "express";

interface Options {
  trimStrings?: boolean;                 // trim all string fields
  normalizeFields?: Record<string, (value: any) => any>; // normalize specific fields
}

export const checkRequiredFields = (
  data: Record<string, any>,
  fields: string[],
  res: Response,
  options: Options = { trimStrings: true, normalizeFields: { email: (v) => v.toLowerCase() } }
): boolean => {
  const missingFields: string[] = [];

  fields.forEach((field) => {
    let value = data[field];

    // Trim strings if enabled
    if (options.trimStrings && typeof value === "string") {
      value = value.trim();
      data[field] = value;
    }

    // Normalize specific fields if provided
    if (options.normalizeFields && options.normalizeFields[field] && value !== undefined) {
      value = options.normalizeFields[field](value);
      data[field] = value;
    }

    // Check for missing or empty
    if (value === undefined || value === "") {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    res.status(400).json({
      message: `Missing required field(s): ${missingFields.join(", ")}`,
    });
    return false;
  }

  return true;
};
