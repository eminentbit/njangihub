// filepath: c:\Users\NTECH\OneDrive\Desktop\WEB PROJECTS\njangi-group-project\frontend\src\components\njangi.form.steps\step1AccountInfo.test.tsx
import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
// import Step1AccountInfo from "./step1AccountInfo";
// import { FormProvider } from "../../context/njangi.form.context";

describe("Step1AccountInfo Component", () => {
  const mockContextValue = {
    state: {
      accountSetup: {
        firstName: "",
        lastName: "",
        phoneNum: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePic: null,
      },
    },
    updateAccountSetup: vi.fn(),
    nextStep: vi.fn(),
  };

  const renderWithContext = () =>
    it("renders the form fields correctly", () => {
      renderWithContext();

      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

  it("validates required fields on form submission", async () => {
    renderWithContext();

    const submitButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(submitButton);

    expect(await screen.findAllByText(/required/i)).toHaveLength(6);
  });

  it("calls nextStep when form is valid", async () => {
    renderWithContext();

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(submitButton);

    expect(mockContextValue.updateAccountSetup).toHaveBeenCalled();
    expect(mockContextValue.nextStep).toHaveBeenCalled();
  });
});
