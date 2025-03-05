import { FIELDS, VISITED } from "./constants";

export type UtilityFields = {
  [VISITED]: string[];
  [FIELDS]: string[];
};

export type ProxableObject = Record<PropertyKey, any> | Array<any>;

export type ProxiedProxableObject = ProxableObject & UtilityFields;

export type Inspector = {
  visited: () => string[];
  fields: () => string[];
  unvisited: () => string[];
};
