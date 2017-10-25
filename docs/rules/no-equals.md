# Disable the use of `equals`, specifically meant for QUnit tests (no-equals)

See [here](https://medium.com/@aptgetfriends/64ccd116a2cd) for the original root
of the rule. Essentially, `equals` in QUnit is `==` which is almost never what
people actually mean. This enforces `deepEquals` or `strictEquals`, depending on
the situation.

## Rule Details

Examples of **incorrect** code for this rule:

- anything that uses `equals` as a function call

```js
equals(1, '1')

equals(["my items"], x)

equals(x, y)
```

Examples of **correct** code for this rule:

```js
strictEquals(1, '1')

deepEquals(["my items"], x)
```

## When Not To Use It

- if you want to referentially compare objects
- if you want to coerce items to primitives
