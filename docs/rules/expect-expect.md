# Expect that expect is called in jest tests (expect-expect)

If people don't call expect in a test, it's not going to work as expected

## Rule Details

We are trying to enforce people calling `expect`, because it is by far the
common occurrence. For the off-chance we explicitly don't want to `expect` in a
test, it can be disabled at the call site.

Examples of **incorrect** code for this rule:

```js

it('should fail', () => {
  // call my code here
  // no expect
})

```

Examples of **correct** code for this rule:

```js

it('should pass', () => {
  // call my code here

  expect(true).toBe(true);
});

it('should also pass', () => {
  someThingAsync()
    .then(() => expect(true).toBe(true));
});

```

## When Not To Use It

If you don't want to enforce `expect` being called in tests

## Further Reading

Inspiration (Code):
[eslint-plugin-jasmine/missing-expect](https://github.com/tlvince/eslint-plugin-jasmine/blob/master/lib/rules/missing-expect.js)

[Jest Issue
Related](https://github.com/facebook/jest/issues/2209#issuecomment-359195316)
