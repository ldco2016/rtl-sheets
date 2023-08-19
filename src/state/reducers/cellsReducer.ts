import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const initialCodeSnippets = [
 `
import React, { useState } from 'react';
  import { render, screen } from '@testing-library/react';
  import user from '@testing-library/user-event';
  
  const Counter = () => {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
  };
  render(<Counter />);`,
  `test('it shows a button', () => {
    render(<Counter />);

    const button = screen.getByRole('button');
    
    expect(button).toBeInTheDocument();
  });`,
  `test('it doesnt show an input', () => {
    render(<Counter />);

    const input = screen.queryByRole('textbox');

    expect(input).not.toBeInTheDocument();
  });`,
  // Add more initial snippets as needed
];

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;

      state.data[id].content = content;
      return state;
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);

      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;

      return state;
    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: initialCodeSnippets[action.payload.orderIndex],
        type: action.payload.type,
        id: randomId(),
        orderIndex: action.payload.orderIndex,
      };

      state.data[cell.id] = cell;

      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );

      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }

      return state;
    default:
      return state;
  }
}, initialState);

const randomId = () => {
  return Math.random().toString(36).substring(2, 5);
};

export default reducer;
