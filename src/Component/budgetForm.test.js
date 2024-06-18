import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setDoc, doc } from "firebase/firestore";
import { auth } from "../firebase";
import BudgetForm from "./BudgetForm";
import { toggleModal } from "./modal";

// Mock Firebase modules
jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("../firebase", () => ({
  auth: {
    currentUser: {
      uid: "test-uid",
    },
  },
  db: {},
}));

jest.mock("./modal", () => ({
  toggleModal: jest.fn(),
}));

describe("BudgetForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the budget form", () => {
    const setBudget = jest.fn();
    render(<BudgetForm budget="1000" setBudget={setBudget} />);

    expect(screen.getByLabelText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Save Budget")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  test("handles input change", () => {
    const setBudget = jest.fn();
    render(<BudgetForm budget="1000" setBudget={setBudget} />);

    const input = screen.getByLabelText("Budget");
    fireEvent.change(input, { target: { value: "2000" } });

    expect(setBudget).toHaveBeenCalledWith("2000");
  });

  test("calls saveBudget on button click", async () => {
    const setBudget = jest.fn();
    render(<BudgetForm budget="1000" setBudget={setBudget} />);

    const mockDocRef = {}; // Mock document reference
    doc.mockReturnValue(mockDocRef);

    const saveButton = screen.getByText("Save Budget");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "test-uid");
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        { budget: 1000 },
        { merge: true }
      );
      expect(toggleModal).toHaveBeenCalled();
    });
  });

  test("does not call saveBudget if no user is logged in", async () => {
    const setBudget = jest.fn();
    auth.currentUser = null; // Simulate no user logged in
    render(<BudgetForm budget="1000" setBudget={setBudget} />);

    const saveButton = screen.getByText("Save Budget");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(setDoc).not.toHaveBeenCalled();
      expect(toggleModal).not.toHaveBeenCalled();
    });
  });
});
