import { describe, expect, it } from "vitest";
import { createIdentifier, isProxableObject } from "./utils";

describe("utils", () => {
  describe("isProxableObject", () => {
    it("should return true for objects", () => {
      expect(isProxableObject({})).toBe(true);
    });

    it("should return true for arrays", () => {
      expect(isProxableObject([])).toBe(true);
    });

    it.each([
      { item: () => {}, name: "functions" },
      { item: "a", name: "primitives" },
      { item: null, name: "nulls" },
      { item: undefined, name: "undefined" },
    ])("should return false for $name", ({ item }) => {
      expect(isProxableObject(item)).toBe(false);
    });
  });

  describe("createIdentifier", () => {
    it("should create identifiers", () => {
      expect(createIdentifier("a", "b")).toBe("a.b");
    });
  });
});
