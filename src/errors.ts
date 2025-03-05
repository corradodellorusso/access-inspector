export class InvalidTargetError extends Error {
  override name = "InvalidTargetError";
  constructor(object: unknown) {
    const type = typeof object !== "object" ? typeof object : "null";
    super(`Target of type ${type} is not a valid target`);
  }
}
