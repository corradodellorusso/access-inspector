import type { ProxableObject } from "./types";

export const isProxableObject = (source: unknown): source is ProxableObject =>
  typeof source === "object" && source !== null;

export const createIdentifier = (parent: string, current: string) =>
  `${parent}.${current}`;
