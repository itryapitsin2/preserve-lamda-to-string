interface Premises {
    length: number;
}

interface Func<T, TResult> {
    (arg: T): TResult;
}

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

gte<Premises>(
    (premises: Premises) => premises.length,
    5
);
