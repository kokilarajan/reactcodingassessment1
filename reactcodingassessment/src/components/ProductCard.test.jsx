

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCard from './ProductCard';
import { useProductContext } from '../context/ProductContext';

jest.mock('../context/ProductContext', () => ({
  useProductContext: jest.fn(),
}));

describe('ProductCard', () => {
  const product = { id: 1, productName: 'Widget', productPrice: 9.5 };
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useProductContext.mockReturnValue({ updateProduct: mockUpdate, deleteProduct: mockDelete });
  });

  test('renders name and price', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByText(/Widget/)).toBeInTheDocument();
    expect(screen.getByText(/Price:/i)).toBeInTheDocument();
    expect(screen.getByText(/\$9.50/)).toBeInTheDocument();
  });

  test('calls deleteProduct when delete clicked', () => {
    render(<ProductCard product={product} />);
    const deleteBtn = screen.getByText('X');
    fireEvent.click(deleteBtn);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  test('edit mode updates and calls updateProduct', async () => {
    render(<ProductCard product={product} />);
    const editBtn = screen.getByText(/Edit/i);
    fireEvent.click(editBtn);

    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0];
    const priceInput = inputs[1];

    fireEvent.change(nameInput, { target: { value: 'Updated' } });
    fireEvent.change(priceInput, { target: { value: '12.34' } });

    const saveBtn = screen.getByText(/Save/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(1, {
        productName: 'Updated',
        productPrice: 12.34,
      });
    });
  });
});

