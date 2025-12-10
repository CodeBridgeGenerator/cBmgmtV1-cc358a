import React from "react";
import { render, screen } from "@testing-library/react";

import FrontendsCreateDialogComponent from "../FrontendsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders frontends create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <FrontendsCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("frontends-create-dialog-component"),
  ).toBeInTheDocument();
});
