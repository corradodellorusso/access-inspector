import { describe, expect, it } from "vitest";

import { inspectAccesses } from "./proxy";

describe("library", () => {
  describe("inspectAccesses", () => {
    it("should throw on invalid targets", () => {
      // @ts-expect-error should not pass numbers
      expect(() => inspectAccesses(1)).toThrowError(
        "Target of type number is not a valid target",
      );
      // @ts-expect-error should not pass strings
      expect(() => inspectAccesses("a")).toThrowError(
        "Target of type string is not a valid target",
      );
      // @ts-expect-error should not pass null
      expect(() => inspectAccesses(null)).toThrowError(
        "Target of type null is not a valid target",
      );
      expect(() => inspectAccesses(() => {})).toThrowError(
        "Target of type function is not a valid target",
      );
    });

    it("should work on flat objects", () => {
      const source = { a: 1, b: 2, c: 3 };
      const [proxy, utils] = inspectAccesses(source);
      const total = proxy.a + proxy.b;
      expect(total).toBe(3);
      expect(utils.fields()).toStrictEqual(["root.a", "root.b", "root.c"]);
      expect(utils.unvisited()).toStrictEqual(["root.c"]);
      expect(utils.visited()).toStrictEqual(["root.a", "root.b"]);
    });

    it("should work on classes", () => {
      class MyClass {
        a = 1;
        b = 2;
        c = 3;
      }
      const source = new MyClass();
      const [proxy, utils] = inspectAccesses(source);
      const total = proxy.a + proxy.b;
      expect(total).toBe(3);
      expect(utils.fields()).toStrictEqual(["root.a", "root.b", "root.c"]);
      expect(utils.unvisited()).toStrictEqual(["root.c"]);
      expect(utils.visited()).toStrictEqual(["root.a", "root.b"]);
    });

    it("should work on arrays", () => {
      const source = [1, 2, 3];
      const [proxy, utils] = inspectAccesses(source);
      const total = proxy[0]! + proxy[1]!;
      expect(total).toBe(3);
      expect(utils.fields()).toStrictEqual(["root.0", "root.1", "root.2"]);
      expect(utils.unvisited()).toStrictEqual(["root.2"]);
      expect(utils.visited()).toStrictEqual(["root.0", "root.1"]);
    });

    it("should work on nested objects", () => {
      const source = { a: { b: { c: 1, d: 1 } } };
      const [proxy, utils] = inspectAccesses(source);
      const total = proxy.a.b.c;
      expect(total).toBe(1);
      expect(utils.fields()).toStrictEqual([
        "root.a",
        "root.a.b",
        "root.a.b.c",
        "root.a.b.d",
      ]);
      expect(utils.unvisited()).toStrictEqual(["root.a.b.d"]);
      expect(utils.visited()).toStrictEqual([
        "root.a",
        "root.a.b",
        "root.a.b.c",
      ]);
    });

    it("should work on nested arrays", () => {
      const source = { a: [{ b: 1 }, { b: 2 }, { b: 3 }] };
      const [proxy, utils] = inspectAccesses(source);
      const total = proxy.a[0]!.b + proxy.a[1]!.b;
      expect(total).toBe(3);
      expect(utils.fields()).toStrictEqual([
        "root.a",
        "root.a.0",
        "root.a.1",
        "root.a.2",
        "root.a.0.b",
        "root.a.1.b",
        "root.a.2.b",
      ]);
      expect(utils.unvisited()).toStrictEqual(["root.a.2", "root.a.2.b"]);
      expect(utils.visited()).toStrictEqual([
        "root.a",
        "root.a.0",
        "root.a.1",
        "root.a.0.b",
        "root.a.1.b",
      ]);
    });
  });
});
