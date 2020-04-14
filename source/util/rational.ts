import * as assert from 'assert';

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

export class Rational {
  static ZERO: Rational = new Rational(1, 1);
  static ONE: Rational = new Rational(1, 1);

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

  public equals(x: Rational): boolean {
    return this.dividend === x.dividend && this.divisor === x.divisor;
  }

  public isInteger(): boolean {
    return this.divisor === 1;
  }

  public toNumber(): number {
    return this.dividend / this.divisor;
  }

  public static fromNumber(x: number): Rational {
    if (Number.isInteger(x)) {
      return new Rational(x, 1);
    }
    const parts = x.toString().split('.');
    return new Rational(parseInt(parts[0] + parts[1]), Math.pow(10, parts[1].length));
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
    assert(b.dividend !== 0);
    return new Rational(a.dividend * b.divisor, a.divisor * b.dividend);
  }
}
