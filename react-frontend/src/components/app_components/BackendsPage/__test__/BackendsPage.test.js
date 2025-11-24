import React from "react";
import { render, screen } from "@testing-library/react";

import BackendsPage from "../BackendsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders backends page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <BackendsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("backends-datatable")).toBeInTheDocument();
    expect(screen.getByRole("backends-add-button")).toBeInTheDocument();
});
