import React from "react";
import { render, screen } from "@testing-library/react";

import FirebasePage from "../FirebasePage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders firebase page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <FirebasePage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("firebase-datatable")).toBeInTheDocument();
    expect(screen.getByRole("firebase-add-button")).toBeInTheDocument();
});
