import * as assert from 'assert';

function gcd(a: number, b: number): number {
  if (b == 0) {
    return a;
  }
  return gcd(b, a % b);
}

export class Rational {
  constructor(private dividend: number, private divisor: number) {
    assert(Number.isInteger(dividend));
    assert(Number.isInteger(divisor));
    assert(divisor !== 0);
    this.reduce();
  }

  private reduce() {
    const factor = gcd(Math.abs(this.dividend), Math.abs(this.divisor));
    this.dividend /= factor;
    this.divisor /= factor;
  }

  public toNumber() {
    return this.dividend / this.divisor;
  }

  public static fromNumber(x: number): Rational {
    let dividend = x;
    let divisor = 1;
    while (!Number.isInteger(dividend)) {
      dividend *= 10;
      divisor *= 10;
    }
    return new Rational(dividend, divisor);
  }

  public static add(a: Rational, b: Rational) {
    const newDividend = (a.dividend * b.divisor) + (b.dividend * a.divisor);
    const newDivisor = a.divisor * b.divisor;
    return new Rational(newDividend, newDivisor);
  }

  public static sub(a: Rational, b: Rational) {
    const newDividend = (a.dividend * b.divisor) - (b.dividend * a.divisor);
    const newDivisor = a.divisor * b.divisor;
    return new Rational(newDividend, newDivisor);
  }

  public static mult(a: Rational, b: Rational) {
    return new Rational(a.dividend * b.dividend, a.divisor * b.divisor);
  }

  public static div(a: Rational, b: Rational) {
    assert(b.dividend != 0);
    return new Rational(a.dividend * b.divisor, a.divisor * b.dividend);
  }
}
