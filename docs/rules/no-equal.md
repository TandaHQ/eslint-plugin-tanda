# Disable the use of `equal`, specifically meant for QUnit tests (no-equal)

See [here](https://medium.com/@aptgetfriends/64ccd116a2cd) for the original root
of the rule. Essentially, `equal` in QUnit is `==` which is almost never what
people actually mean. This enforces `deepEqual` or `strictEqual`, depending on
the situation.

## Rule Details

Examples of **incorrect** code for this rule:

- anything that uses `equal` as a function call

```js
equal(1, '1')

equal(["my items"], x)

equal(x, y)
```

Examples of **correct** code for this rule:

```js
strictEqual(1, '1')

deepEqual(["my items"], x)
```

## When Not To Use It

- if you want to referentially compare objects
- if you want to coerce items to primitives
