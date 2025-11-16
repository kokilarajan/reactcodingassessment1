import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductDashboard from './ProductDashboard';
import { useProductContext } from '../context/ProductContext';

jest.mock('../context/ProductContext', () => ({
  useProductContext: jest.fn(),
}));

describe('Product list integration', () => {
  test('product-list contains correct number of items', () => {
    const products = [
      { id: 1, productName: 'One', productPrice: 10 },
      { id: 2, productName: 'Two', productPrice: 20 },
      { id: 3, productName: 'Three', productPrice: 30 },
    ];
    useProductContext.mockReturnValue({ products, message: null });
    const { container } = render(<ProductDashboard />);
    // count rendered .item elements
    const items = container.querySelectorAll('.item');
    expect(items.length).toBe(3);
  });
});
