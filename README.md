# access-inspector 🔍

[![npm version](https://img.shields.io/npm/v/access-inspector)](https://www.npmjs.com/package/access-inspector)  
[![bundle size](https://img.shields.io/bundlephobia/minzip/access-inspector)](https://bundlephobia.com/package/access-inspector)  
[![license](https://img.shields.io/npm/l/access-inspector)](https://github.com/yourusername/access-inspector/blob/main/LICENSE)

🚀 **Access Inspector** is a zero-dependency utility that tracks which properties of an object have been accessed using JavaScript Proxies.

Useful for:  
✅ Debugging & Auditing – find out which properties are actually used  
✅ GraphQL & API Optimization – ensure requested fields are needed

---

## 📦 Installation

```sh
npm install access-inspector
# or
yarn add access-inspector
# or
pnpm add access-inspector
```

## 🚀 Usage

```typescript
import { inspectAccesses } from "access-inspector";

const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

const [trackedUser, inspector] = inspectAccesses(user);

console.log(trackedUser.name); // "Alice"
console.log(trackedUser.email); // "alice@example.com"

console.log(inspector.fields()); // ["root.id", "root.name", "root.email"]
console.log(inspector.visited()); // ["root.name", "root.email"]
console.log(inspector.unvisited()); // ["root.id"]
```

It works with arrays and nested objects as well!

```typescript
import { inspectAccesses } from "access-inspector";

const user = {
  id: 1,
  flags: ["admin", "verified"],
  contacts: {
    phone: "123-456-7890",
    email: "alice@example.com",
  },
};

const [trackedUser, inspector] = inspectAccesses(user);

console.log(trackedUser.flags[0]); // "admin"
console.log(trackedUser.contacts.phone); // "123-456-7890"

console.log(inspector.fields()); // ["root.id", "root.flags", "root.flags.0", "root.flags.1", "root.contacts", "root.contacts.phone", "root.contacts.email"]
console.log(inspector.visited()); // ["root.flags", "root.flags.0", "root.contacts", "root.contacts.phone"]
console.log(inspector.unvisited()); // ["root.id", "root.flags.1", "root.contacts.email"]
```
