import React from "react";
import { render, screen } from "@testing-library/react";

import CrmPage from "../CrmPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders crm page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CrmPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("crm-datatable")).toBeInTheDocument();
  expect(screen.getByRole("crm-add-button")).toBeInTheDocument();
});
