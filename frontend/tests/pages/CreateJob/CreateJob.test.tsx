import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateJob from '../../../src/Pages/CreateJob/CreateJob';
import { MemoryRouter } from 'react-router';
import { expect, it, describe } from 'vitest';


describe('CreateJob Component', () => {
  it('renders the component without errors', () => {
    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );
    expect(screen.getByText('Create New Job Listing')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Role')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Pay')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Required Skills')).toBeInTheDocument();
    expect(screen.getByText('Proceed')).toBeInTheDocument();
  });

  it('displays validation errors when fields are empty and submitted', async () => {
    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Proceed'));

    expect(await screen.findByText('Job role is required')).toBeInTheDocument();
    expect(await screen.findByText('Location is required')).toBeInTheDocument();
    expect(await screen.findByText('Job pay is required')).toBeInTheDocument();
    expect(await screen.findByText('Description is required')).toBeInTheDocument();
    expect(await screen.findByText('Skills are required')).toBeInTheDocument();
  });

  it('allows selecting job type from dropdown', async () => {
    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );

    // Open the dropdown for "Job Type"
    const jobTypeDropdown = screen.getAllByLabelText('Job Type')[0];
    fireEvent.mouseDown(jobTypeDropdown);

    // Select "Part Time" from the dropdown options
    const partTimeOption = await screen.findByText('Part Time');
    fireEvent.click(partTimeOption);

    // Check that "Part Time" is now selected in the dropdown
    expect(jobTypeDropdown).toHaveTextContent('Part Time');
  });
  

  it('updates the required skills field correctly', () => {
    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );

    const requiredSkillsInput = screen.getByLabelText('Required Skills');
    fireEvent.change(requiredSkillsInput, { target: { value: 'Python, SQL' } });
    expect(requiredSkillsInput).toHaveValue('Python, SQL');
  });
});

