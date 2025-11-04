import React from "react";
import { render, screen } from "@testing-library/react";

import FirebaseEditDialogComponent from "../FirebaseEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders firebase edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <FirebaseEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("firebase-edit-dialog-component")).toBeInTheDocument();
});
