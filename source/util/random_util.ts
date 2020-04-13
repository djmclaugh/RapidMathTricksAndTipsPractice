/**
 * Returns a uniformaly random integer from the interval [0, max).
 */
export function randomInt(max: number): number {
  return Math.floor(Math.random() * Math.ceil(max))
}

/**
 * Returns a uniformaly random integer from the interval [0, max).
 */
export function randomFromArray<T>(array: Array<T>): T {
  return array[randomInt(array.length)];
}

export function suffle<T>(array: Array<T>): void {
  for (let i = 0; i < array.length; ++i) {
    const swapIndex = i + randomInt(array.length - i);
    const temp = array[i];
    array[i] = array[swapIndex];
    array[swapIndex] = temp;
  }
}
