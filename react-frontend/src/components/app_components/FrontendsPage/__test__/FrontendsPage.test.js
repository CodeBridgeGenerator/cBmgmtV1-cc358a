import React from "react";
import { render, screen } from "@testing-library/react";

import FrontendsPage from "../FrontendsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders frontends page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <FrontendsPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("frontends-datatable")).toBeInTheDocument();
  expect(screen.getByRole("frontends-add-button")).toBeInTheDocument();
});
