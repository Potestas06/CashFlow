import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ExpensesList from "./expensesList";
import dialogPolyfill from "dialog-polyfill";

// Mock for dialogPolyfill
jest.mock("dialog-polyfill", () => ({
  registerDialog: jest.fn(),
}));

describe("ExpensesList Component", () => {
  beforeEach(() => {
    render(<ExpensesList />);
  });

  it("opens and closes the delete modal", async () => {
    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    const dialog = document.getElementById("deleteModal");
    dialogPolyfill.registerDialog(dialog);
    dialog.showModal = jest.fn();
    dialog.close = jest.fn();

    await waitFor(() => {
      expect(dialog.showModal).toHaveBeenCalled();
    });

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(dialog.close).toHaveBeenCalled();
    });
  });

  it("calls the appropriate function on delete confirmation", async () => {
    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    const dialog = document.getElementById("deleteModal");
    dialogPolyfill.registerDialog(dialog);
    dialog.showModal = jest.fn();
    dialog.close = jest.fn();

    await waitFor(() => {
      expect(dialog.showModal).toHaveBeenCalled();
    });

    // Mock die Funktion, die den Löschvorgang ausführt
    const mockDeleteFunction = jest.fn();
    ExpensesList.prototype.handleDelete = mockDeleteFunction;

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteFunction).toHaveBeenCalled();
      expect(dialog.close).toHaveBeenCalled();
    });
  });

  it("does not call delete function if no user is logged in", async () => {
    // Set up your mock to simulate no user logged in
    jest.mock("./auth", () => ({
      currentUser: null,
    }));

    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);

    const dialog = document.getElementById("deleteModal");
    dialogPolyfill.registerDialog(dialog);
    dialog.showModal = jest.fn();
    dialog.close = jest.fn();

    await waitFor(() => {
      expect(dialog.showModal).toHaveBeenCalled();
    });

    const mockDeleteFunction = jest.fn();
    ExpensesList.prototype.handleDelete = mockDeleteFunction;

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteFunction).not.toHaveBeenCalled();
      expect(dialog.close).toHaveBeenCalled();
    });
  });
});
