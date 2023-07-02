import React from "react";
import { render } from "@testing-library/react";
const { assert } = require("chai");
const { setupServer } = require("msw/node");
const { rest } = require("msw");

describe("Simple Test Case", () => {
  it("Should return 4", () => {
    const app = <div>example</div>;

    const { container } = render(app);

    console.log(container.outerHTML);

    expect(container.textContent).toBe("example");
  });
});
