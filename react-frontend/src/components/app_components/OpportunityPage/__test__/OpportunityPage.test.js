import React from "react";
import { render, screen } from "@testing-library/react";

import OpportunityPage from "../OpportunityPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders opportunity page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <OpportunityPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("opportunity-datatable")).toBeInTheDocument();
    expect(screen.getByRole("opportunity-add-button")).toBeInTheDocument();
});
