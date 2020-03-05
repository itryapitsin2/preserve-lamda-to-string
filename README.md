# preserve-lamda-to-string
![Node.js CI](https://github.com/itryapitsin2/preserve-lamda-to-string/workflows/Node.js%20CI/badge.svg)

Babel plugin for preserving lambda expressions to string.
Preserve to string can help to use type-saving for mapping navigation to class field/property.

```typescript
function gte<T>(
    a: (T) => any,
    b: any
) {
    try {
        return `${a(undefined)}__gte=${b}`;
    } catch (e) {
        console.log("Mark a lambda expression as preserve-to-string");
        return "";
    }
}

console.log(
    gte<Premises>(
        // preserve-to-string
        (premises: Premises) => premises.length,
        5
    )
);
```

output is

```
premises_length__gte=5
```
