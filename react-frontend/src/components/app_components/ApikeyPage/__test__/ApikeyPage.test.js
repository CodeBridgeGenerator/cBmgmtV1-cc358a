import React from "react";
import { render, screen } from "@testing-library/react";

import ApikeyPage from "../ApikeyPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders apikey page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ApikeyPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("apikey-datatable")).toBeInTheDocument();
  expect(screen.getByRole("apikey-add-button")).toBeInTheDocument();
});
