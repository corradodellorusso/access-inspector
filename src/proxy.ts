import type {
  UtilityFields,
  ProxableObject,
  ProxiedProxableObject,
  Inspector,
} from "./types";
import { createIdentifier, isProxableObject } from "./utils";
import { InvalidTargetError } from "./errors";
import { FIELDS, VISITED } from "./constants";

const createProxy = <T extends ProxableObject>(
  target: T,
  parent: string,
): T & UtilityFields => {
  if (!isProxableObject(target)) {
    throw new InvalidTargetError(target);
  }
  const proxies: ProxiedProxableObject[] = [];
  const fields = new Set<string>();
  const visited = new Set<string>();

  Object.keys(target).forEach((key) => {
    const child = target[key as keyof T];
    if (isProxableObject(child)) {
      const proxy = createProxy(child, createIdentifier(parent, key));
      proxies.push(proxy);
      // @ts-expect-error T cannot be indexed for writing
      target[key] = proxy;
    }
    fields.add(createIdentifier(parent, key));
  });

  return new Proxy(target, {
    get(target: ProxableObject, key: string, receiver: any): any {
      if (key === VISITED) {
        const items = Array.from(visited);
        for (const proxy of proxies) {
          items.push(...proxy[VISITED]);
        }
        return items;
      }
      if (key === FIELDS) {
        const items = Array.from(fields);
        for (const proxy of proxies) {
          items.push(...proxy[FIELDS]);
        }
        return items;
      }
      const identifier = createIdentifier(parent, key);
      if (fields.has(identifier)) {
        visited.add(identifier);
      }
      return Reflect.get(target, key, receiver);
    },
  }) as T & UtilityFields;
};

export const inspectAccesses = <T extends ProxableObject>(
  source: T,
): [T, Inspector] => {
  const proxy = createProxy(source, "root");
  return [
    proxy,
    {
      visited: () => proxy[VISITED],
      fields: () => proxy[FIELDS],
      unvisited: () =>
        proxy[FIELDS].filter((field) => !proxy[VISITED].includes(field)),
    },
  ] as const;
};
