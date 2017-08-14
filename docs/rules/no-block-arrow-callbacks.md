# Prevents the bad practice of complex callback chains

## Rule Details

This rule was inspired by the functional practices of functional
composition. It is unfortunately quite common in javascript to compose
complex chains of callbacks using just function expressions.

This rule pushes the developer to keep there higher level abstractions
clean by only allowing defined functions, or blockless arrow functions
to be used as callbacks.

Examples of **incorrect** code for this rule:

```js
/* eslint no-arrow-block-callbacks: "error" */
anArray
  .map(x => {
    const xPlus10 =       //
      x + 10              // Complex inline callbacks muddy the abstraction
                          //
    return xPlus10
  })

```

Examples of **correct** code for this rule:

```js
/* eslint no-arrow-block-callbacks: "error" */
anArray
  .map(x => x + 10)
  .map(x => x - 9)

anArray
  .map(adds10)
  .map(minus9)

anArray                     //
  .map(function add10(x) {  // Allowed for es5 tanda
    return x + 10           //
  })
```

## When Not To Use It
This rule is quite restricting... may not want to buy in.
