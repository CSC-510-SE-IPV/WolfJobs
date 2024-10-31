import { render, screen, fireEvent } from "@testing-library/react";
import JobQuestionnaire from "../../../src/Pages/CreateJob/jobQuestionnaire";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { act } from "react-dom/test-utils";

describe("JobQuestionnaire Component", () => {
  const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={ui} />
          <Route path="/job_preview" element={<div>Job Preview</div>} />
        </Routes>
      </MemoryRouter>
    );
  };
  

  test("renders the component without errors", () => {
    renderWithRouter(<JobQuestionnaire />);

    const headings = screen.getAllByText("Fill Questionnaire");
    expect(headings.length).toBeGreaterThan(0);  // Ensures that the component is rendered correctly
    expect(screen.getByText("Add Question")).toBeInTheDocument();
    expect(screen.getByText("Proceed")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  test("renders a default question field", () => {
    renderWithRouter(<JobQuestionnaire />);
    expect(screen.getByLabelText("Question 1")).toBeInTheDocument();
  });

  test("adds a new question field when 'Add Question' button is clicked", async () => {
    renderWithRouter(<JobQuestionnaire />);
    const addButton = screen.getByText("Add Question");

    await act(async () => {
      fireEvent.click(addButton);
    });

    expect(screen.getByLabelText("Question 2")).toBeInTheDocument();
  });

  test("removes a question field when 'Delete' button is clicked", async () => {
    renderWithRouter(<JobQuestionnaire />);
    const addButton = screen.getByText("Add Question");

    // Add a question to ensure we have more than one
    await act(async () => {
      fireEvent.click(addButton);
    });

    const deleteButton = screen.getAllByText("Delete")[1];
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(screen.queryByLabelText("Question 2")).not.toBeInTheDocument();
  });

  test("displays error message when a question field is left empty and 'Proceed' is clicked", async () => {
    renderWithRouter(<JobQuestionnaire />);
    const proceedButton = screen.getByText("Proceed");

    await act(async () => {
      fireEvent.click(proceedButton);
    });

    expect(await screen.findByText("Question is required")).toBeInTheDocument();
  });

  test("navigates to 'Job Preview' when form is filled and 'Proceed' button is clicked", async () => {
    renderWithRouter(<JobQuestionnaire />);
    const questionInput = screen.getByLabelText("Question 1");

    await act(async () => {
      fireEvent.change(questionInput, { target: { value: "Sample question" } });
      fireEvent.click(screen.getByText("Proceed"));
    });

    expect(screen.getByText("Job Preview")).toBeInTheDocument();
  });

  test("navigates back when 'Back' button is clicked", () => {
    renderWithRouter(<JobQuestionnaire />, { route: "/" });
    const backButton = screen.getByText("Back");

    fireEvent.click(backButton);

    expect(window.location.pathname).toBe("/");
  });
});
