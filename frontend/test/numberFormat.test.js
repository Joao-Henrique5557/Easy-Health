const test = require("node:test");
const assert = require("node:assert/strict");
const { formatDecimal } = require("../src/utils/numberFormat");

test("formats valid numeric values to one decimal place", () => {
  assert.equal(formatDecimal(4), "4.0");
  assert.equal(formatDecimal("3.26"), "3.3");
  assert.equal(formatDecimal(0), "0.0");
});

test("returns null for missing or invalid values", () => {
  for (const value of [undefined, null, "", " ", "not-a-number", NaN, Infinity, true]) {
    assert.equal(formatDecimal(value), null);
  }
});
