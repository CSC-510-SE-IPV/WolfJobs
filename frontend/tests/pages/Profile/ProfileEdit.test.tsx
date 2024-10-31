import { render, screen, fireEvent, waitFor  } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProfileEdit from "../../../src/Pages/Profile/ProfileEdit"; // Adjust path as needed
import axios from "axios";

vi.mock("axios"); // Mock axios

describe("ProfileEdit Component", () => {
  const mockProps = {
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St",
    role: "Developer",
    skills: "React, Node.js",
    phonenumber: "1234567890",
    availability: "8 Hours",
    gender: "Male",
    hours: "8",
    
  };

  it("renders the ProfileEdit component with form fields", () => {
    render(
      <MemoryRouter>
        <ProfileEdit props={mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Availability")).toBeInTheDocument();
    expect(screen.getByLabelText("Gender")).toBeInTheDocument();
  });

  it("submits the form with correct values", async () => {
    render(
      <MemoryRouter>
        <ProfileEdit props={mockProps} />
      </MemoryRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: "0987654321" } });

    // Simulate selecting new values in dropdowns
    fireEvent.mouseDown(screen.getByLabelText("Availability"));
    fireEvent.click(screen.getByText("12 Hours"));
    fireEvent.mouseDown(screen.getByLabelText("Gender"));
    fireEvent.click(screen.getByText("Female"));

    // Mocking the axios post request
    axios.post.mockResolvedValue({ status: 200 }); // Mock successful response

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /save profile/i }));

    // Debugging output: Check if the axios post was called
    console.log("Mocked axios.post calls:", axios.post.mock.calls); // Log the calls for debugging

    // Wait for the axios.post to be called with correct arguments
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled(); // Check if axios.post was called
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/api/v1/users/edit", {
        id: expect.any(String), // Assuming userId is a string
        name: "Jane Doe",
        role: "Developer",
        email: "john.doe@example.com",
        password: expect.any(String), // Assuming the password is handled internally
        address: "123 Main St",
        availability: "12 Hours",
        hours: "8",
        gender: "Female",
        skills: "React, Node.js",
        phonenumber: "0987654321",
      });
    });
  });
});
