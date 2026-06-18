import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';
import { describe, it, expect, vi } from 'vitest';

function TestComponent({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(true);
  const trapRef = useFocusTrap({
    isActive: isOpen,
    onClose: () => {
      setIsOpen(false);
      onClose();
    }
  });

  return (
    <div>
      <button id="trigger">Trigger</button>
      {isOpen && (
        <div ref={trapRef} data-testid="trap-container">
          <button id="btn1">Button 1</button>
          <input id="input2" placeholder="Input 2" />
          <button id="btn3">Button 3</button>
        </div>
      )}
    </div>
  );
}

describe('useFocusTrap hook', () => {
  it('should focus the first element inside the trap on mount', async () => {
    const onCloseMock = vi.fn();
    render(<TestComponent onClose={onCloseMock} />);
    
    await waitFor(() => {
      expect(document.getElementById('btn1')).toHaveFocus();
    });
  });

  it('should close the trap when Escape key is pressed', async () => {
    const onCloseMock = vi.fn();
    render(<TestComponent onClose={onCloseMock} />);
    
    await waitFor(() => {
      expect(document.getElementById('btn1')).toHaveFocus();
    });

    fireEvent.keyDown(document.getElementById('btn1')!, { key: 'Escape', code: 'Escape' });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('trap-container')).not.toBeInTheDocument();
  });

  it('should cycle focus circularly on Tab keypress', async () => {
    const onCloseMock = vi.fn();
    render(<TestComponent onClose={onCloseMock} />);
    
    await waitFor(() => {
      expect(document.getElementById('btn1')).toHaveFocus();
    });

    const btn1 = document.getElementById('btn1')!;
    const btn3 = document.getElementById('btn3')!;

    // Focus the last element
    btn3.focus();
    expect(btn3).toHaveFocus();

    // Tab on the last element -> should cycle focus back to btn1
    fireEvent.keyDown(btn3, { key: 'Tab', code: 'Tab' });
    expect(btn1).toHaveFocus();

    // Shift + Tab on the first element -> should cycle focus back to btn3
    fireEvent.keyDown(btn1, { key: 'Tab', code: 'Tab', shiftKey: true });
    expect(btn3).toHaveFocus();
  });
});
