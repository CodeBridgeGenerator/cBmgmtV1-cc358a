import React from "react";
import { render, screen } from "@testing-library/react";

import ContractPage from "../ContractPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders contract page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ContractPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("contract-datatable")).toBeInTheDocument();
    expect(screen.getByRole("contract-add-button")).toBeInTheDocument();
});
