import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

const TestModalComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [taskTitle, setTaskTitle] = useState('');

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Sprint Task">
        <Input
          label="Task Title"
          data-testid="task-title-input"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </Modal>
    </div>
  );
};

describe('Modal Component Focus Handling', () => {
  it('maintains input focus while user types multiple characters', async () => {
    const user = userEvent.setup();
    render(<TestModalComponent />);

    const input = screen.getByTestId('task-title-input') as HTMLInputElement;

    // Focus input and type multi-letter title
    await user.click(input);
    await user.type(input, 'Implement GraphQL API');

    expect(input.value).toBe('Implement GraphQL API');
    expect(document.activeElement).toBe(input);
  });
});
