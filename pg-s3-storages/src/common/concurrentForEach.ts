import { map } from "bluebird";

// Statically set the concurrency level to a value which should be good for all
// of our use cases
const CONCURRENCY = 5;

// Wrapper for the map function of bluebird which allows specifying a
// concurrency level for the execution of the iterator function. Since we use
// the function for side effects only, we discard the result of the map
// operation
export default async function concurrentForEach<T>(
    array: T[],
    iterator: (arrayElement: T, arrayElementIndex: number) => Promise<any>
): Promise<void> {
    await map(array, iterator, { concurrency: CONCURRENCY });
}
