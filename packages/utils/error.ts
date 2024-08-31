import { isString } from "lodash-es";

class WanElementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WanElementError";
  }
}

export function throwError(scope: string, msg: string): never {
  throw new WanElementError(`[${scope}] ${msg}`);
}

export function debugWarn(err: Error): void;
export function debugWarn(scope: string, msg: string): void;
export function debugWarn(scope: string | Error, msg?: string) {
  if (process.env.NODE_ENV !== "production") {
    const err = isString(scope)
      ? new WanElementError(`[${scope}] ${msg}`)
      : scope;
    console.warn(err);
  }
}
