import { test } from "node:test";
import assert from "node:assert/strict";

import { parseProductInput } from "../lib/product-validation";

test("accepts valid product payload", () => {
  const valid = parseProductInput({
    name: "Shoe",
    description: "Comfortable everyday running shoe",
    price: "500",
    discount: "10",
    stock: "12",
    sku: "SHOE-PUMA-00",
    brand: "Puma",
    categoryId: "fashion-id"
  });

  assert.equal(valid.success, true);
  if (valid.success) {
    assert.equal(valid.data.name, "Shoe");
    assert.equal(valid.data.sku, "SHOE-PUMA-00");
  }
});

test("rejects invalid product payload with clear message", () => {
  const invalid = parseProductInput({
    name: "S",
    description: "short",
    price: "-1",
    discount: "120",
    stock: "-2",
    sku: "",
    brand: "",
    categoryId: ""
  });

  assert.equal(invalid.success, false);
  if (!invalid.success) {
    const messages = invalid.error.issues.map((issue) => issue.message).join(" ");
    assert.match(messages, /Product name|Description|Price|Discount|Stock|SKU|category/i);
  }
});
