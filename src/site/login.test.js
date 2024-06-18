import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import Login from "./Login";

// Mock Firebase auth module
jest.mock("firebase/auth", () => {
  const originalModule = jest.requireActual("firebase/auth");
  return {
    ...originalModule,
    getAuth: jest.fn(() => ({
      signInWithEmailAndPassword: jest.fn(),
    })),
    signInWithEmailAndPassword: jest.fn(),
  };
});

jest.mock("../Component/modal", () => ({
  toggleModal: jest.fn(),
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the login form", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("allows the user to input email and password", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    expect(screen.getByPlaceholderText("Email").value).toBe("test@example.com");
    expect(screen.getByPlaceholderText("Password").value).toBe("password");
  });

  test("displays an error message when login fails", async () => {
    signInWithEmailAndPassword.mockRejectedValue({
      message: "Invalid credentials",
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("calls signInWithEmailAndPassword on form submission", async () => {
    signInWithEmailAndPassword.mockResolvedValue({});

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password"
      );
    });

    // Check if the successful login button is clicked
    const loginButton = screen.getByTestId("successfulLoginButton");
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Login successful!")).toBeInTheDocument();
    });
  });
});
