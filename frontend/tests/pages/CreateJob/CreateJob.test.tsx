import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateJob from '../../../src/Pages/CreateJob/CreateJob';
import { MemoryRouter } from 'react-router';

describe('CreateJob Component', () => {
  it('renders the component without errors', () => {
    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );
    expect(screen.getByText('Create New Job Listing')).to.exist;
    expect(screen.getByLabelText('Job Role')).to.exist;
    expect(screen.getByLabelText('Job Type')).to.exist;
    expect(screen.getByLabelText('Location')).to.exist;
    expect(screen.getByLabelText('Pay')).to.exist;
    expect(screen.getByLabelText('Job Description')).to.exist;
    expect(screen.getByLabelText('Required Skills')).to.exist;
    expect(screen.getByText('Proceed')).to.exist;
  });

  it('displays validation errors when fields are empty and submitted', async () => {
    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Proceed'));

    expect(await screen.findByText('Job role is required')).to.exist;
    expect(await screen.findByText('Location is required')).to.exist;
    expect(await screen.findByText('Job pay is required')).to.exist;
    expect(await screen.findByText('Description is required')).to.exist;
    expect(await screen.findByText('Skills are required')).to.exist;
  });

  it('navigates to questionnaire on form submission with filled inputs', async () => {
    const navigateMock = jest.fn(); // Mock for navigation

    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Job Role'), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Remote' } });
    fireEvent.change(screen.getByLabelText('Pay'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('Job Description'), { target: { value: 'Develop and maintain software' } });
    fireEvent.change(screen.getByLabelText('Required Skills'), { target: { value: 'React, TypeScript, Node.js' } });

    fireEvent.click(screen.getByText('Proceed'));

    // Here you should verify the redirection logic based on your routing implementation
    // For example:
    // expect(navigateMock).to.have.been.calledWith('/job_questionnaire', { ... });
  });

  it('allows selecting job type from dropdown', () => {
    render(
      <MemoryRouter>
        <CreateJob />
      </MemoryRouter>
    );

    fireEvent.mouseDown(screen.getByLabelText('Job Type'));
    fireEvent.click(screen.getByText('Part Time'));
    expect(screen.getByLabelText('Job Type')).toHaveTextContent('Part Time');
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
