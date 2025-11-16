import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDashboard from './ProductDashboard';
import { useProductContext } from '../context/ProductContext';

jest.mock('../context/ProductContext', () => ({
  useProductContext: jest.fn(),
}));

jest.mock('./ProductCard', () => {
  return function MockProductCard({ product }) {
    return <div data-testid={`product-card-${product.id}`}>{product.productName}</div>;
  };
});

jest.mock('./ProductForm', () => {
  return function MockProductForm({ onClose }) {
    return (
      <div data-testid="product-form">
        <button onClick={onClose}>Close Form</button>
      </div>
    );
  };
});

describe('ProductDashboard', () => {
  const mockProducts = [
    { id: 1, productName: 'Product 1', productPrice: 10 },
    { id: 2, productName: 'Product 2', productPrice: 20 },
    { id: 3, productName: 'Product 3', productPrice: 30 },
  ];

  const mockClearMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useProductContext.mockReturnValue({
      products: mockProducts,
      message: null,
      clearMessage: mockClearMessage,
    });
  });

  describe('Render Tests', () => {
    test('should render the dashboard with products heading', () => {
      render(<ProductDashboard />);
      const heading = screen.getByText('Products');
      expect(heading).toBeInTheDocument();
    });

    test('should render all products when available', () => {
      render(<ProductDashboard />);
      mockProducts.forEach(product => {
        expect(screen.getByText(product.productName)).toBeInTheDocument();
      });
    });

    test('should render "No Products Available" when products list is empty', () => {
      useProductContext.mockReturnValue({
        products: [],
        message: null,
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      expect(screen.getByText('No Products Available')).toBeInTheDocument();
    });

    test('should render "No Products Available" when products is null', () => {
      useProductContext.mockReturnValue({
        products: null,
        message: null,
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      expect(screen.getByText('No Products Available')).toBeInTheDocument();
    });
  });

  describe('Add Product Button Tests', () => {
    test('should render "Add Product" button initially', () => {
      render(<ProductDashboard />);
      const addButton = screen.getByRole('button', { name: /Add Product/i });
      expect(addButton).toBeInTheDocument();
    });

    test('should show ProductForm when Add Product button is clicked', () => {
      render(<ProductDashboard />);
      const addButton = screen.getByRole('button', { name: /Add Product/i });

      fireEvent.click(addButton);

      expect(screen.getByTestId('product-form')).toBeInTheDocument();
    });

    test('should change button to Cancel when form is open', () => {
      render(<ProductDashboard />);
      const addButton = screen.getByRole('button', { name: /Add Product/i });

      fireEvent.click(addButton);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Add Product/i })).not.toBeInTheDocument();
    });
  });

  describe('Cancel Button Tests', () => {
    test('should close form when Cancel button is clicked', () => {
      render(<ProductDashboard />);
      const addButton = screen.getByRole('button', { name: /Add Product/i });

      fireEvent.click(addButton);
      expect(screen.getByTestId('product-form')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByTestId('product-form')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument();
    });

    test('should show Add Product button again after canceling', () => {
      render(<ProductDashboard />);
      const addButton = screen.getByRole('button', { name: /Add Product/i });

      fireEvent.click(addButton);
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument();
    });
  });

  describe('Message Banner Tests', () => {
    test('should display message banner when message is present', () => {
      useProductContext.mockReturnValue({
        products: mockProducts,
        message: 'Product added successfully',
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      expect(screen.getByText('Product added successfully')).toBeInTheDocument();
    });

    test('should display message close button', () => {
      useProductContext.mockReturnValue({
        products: mockProducts,
        message: 'Success message',
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const closeButton = screen.getByRole('button', { name: /Close message/i });
      expect(closeButton).toBeInTheDocument();
    });

    test('should call clearMessage when close button is clicked', () => {
      useProductContext.mockReturnValue({
        products: mockProducts,
        message: 'Success message',
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const closeButton = screen.getByRole('button', { name: /Close message/i });

      fireEvent.click(closeButton);

      expect(mockClearMessage).toHaveBeenCalled();
    });

    test('should not display message banner when message is null', () => {
      useProductContext.mockReturnValue({
        products: mockProducts,
        message: null,
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const messageElement = screen.queryByRole('alert');
      expect(messageElement).not.toBeInTheDocument();
    });

    test('should not display message banner when message is empty string', () => {
      useProductContext.mockReturnValue({
        products: mockProducts,
        message: '',
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const messageElement = screen.queryByRole('alert');
      expect(messageElement).not.toBeInTheDocument();
    });
  });

  describe('Pagination Tests', () => {
    test('should not show pagination when products are 10 or fewer', () => {
      render(<ProductDashboard />);
      const paginationButtons = screen.queryAllByRole('button', { name: /Prev|Next/i });
      expect(paginationButtons).toHaveLength(0);
    });

    test('should show pagination when products exceed PAGE_SIZE', () => {
      const manyProducts = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        productName: `Product ${i + 1}`,
        productPrice: (i + 1) * 10,
      }));

      useProductContext.mockReturnValue({
        products: manyProducts,
        message: null,
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const prevButton = screen.getByRole('button', { name: /Prev/i });
      const nextButton = screen.getByRole('button', { name: /Next/i });

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    test('should disable Prev button on first page', () => {
      const manyProducts = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        productName: `Product ${i + 1}`,
        productPrice: (i + 1) * 10,
      }));

      useProductContext.mockReturnValue({
        products: manyProducts,
        message: null,
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const prevButton = screen.getByRole('button', { name: /Prev/i });

      expect(prevButton).toBeDisabled();
    });

    test('should enable Next button on first page if multiple pages exist', () => {
      const manyProducts = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        productName: `Product ${i + 1}`,
        productPrice: (i + 1) * 10,
      }));

      useProductContext.mockReturnValue({
        products: manyProducts,
        message: null,
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const nextButton = screen.getByRole('button', { name: /Next/i });

      expect(nextButton).not.toBeDisabled();
    });

    test('should navigate to next page when Next button is clicked', () => {
      const manyProducts = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        productName: `Product ${i + 1}`,
        productPrice: (i + 1) * 10,
      }));

      useProductContext.mockReturnValue({
        products: manyProducts,
        message: null,
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const nextButton = screen.getByRole('button', { name: /Next/i });

      fireEvent.click(nextButton);

      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });

    test('should display correct page information', () => {
      const manyProducts = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        productName: `Product ${i + 1}`,
        productPrice: (i + 1) * 10,
      }));

      useProductContext.mockReturnValue({
        products: manyProducts,
        message: null,
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });
  });

  describe('ProductForm Display Tests', () => {
    test('should render ProductForm when showForm is true', () => {
      render(<ProductDashboard />);
      const addButton = screen.getByRole('button', { name: /Add Product/i });

      fireEvent.click(addButton);

      expect(screen.getByTestId('product-form')).toBeInTheDocument();
    });

    test('should not render ProductForm initially', () => {
      render(<ProductDashboard />);
      expect(screen.queryByTestId('product-form')).not.toBeInTheDocument();
    });

    test('should close ProductForm when onClose is called', () => {
      render(<ProductDashboard />);
      const addButton = screen.getByRole('button', { name: /Add Product/i });

      fireEvent.click(addButton);
      expect(screen.getByTestId('product-form')).toBeInTheDocument();

      const closeFormButton = screen.getByText('Close Form');
      fireEvent.click(closeFormButton);

      expect(screen.queryByTestId('product-form')).not.toBeInTheDocument();
    });
  });

  describe('Context Integration Tests', () => {
    test('should call useProductContext hook', () => {
      render(<ProductDashboard />);
      expect(useProductContext).toHaveBeenCalled();
    });

    test('should use products from context', () => {
      render(<ProductDashboard />);
      mockProducts.forEach(product => {
        expect(screen.getByText(product.productName)).toBeInTheDocument();
      });
    });

    test('should use clearMessage from context', () => {
      useProductContext.mockReturnValue({
        products: mockProducts,
        message: 'Test message',
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const closeButton = screen.getByRole('button', { name: /Close message/i });
      fireEvent.click(closeButton);

      expect(mockClearMessage).toHaveBeenCalled();
    });
  });

  describe('Product Card Rendering Tests', () => {
    test('should render ProductCard for each product', () => {
      render(<ProductDashboard />);
      mockProducts.forEach(product => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
      });
    });

    test('should render correct number of ProductCards on first page', () => {
      render(<ProductDashboard />);
      const productCards = screen.getAllByTestId(/^product-card-/);
      expect(productCards).toHaveLength(mockProducts.length);
    });

    test('should render only 10 products on first page when more than 10 exist', () => {
      const manyProducts = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        productName: `Product ${i + 1}`,
        productPrice: (i + 1) * 10,
      }));

      useProductContext.mockReturnValue({
        products: manyProducts,
        message: null,
        clearMessage: mockClearMessage,
      });

      render(<ProductDashboard />);
      const productCards = screen.getAllByTestId(/^product-card-/);
      expect(productCards).toHaveLength(10);
    });
  });

  describe('Edge Cases', () => {
    test('should handle rapid Add/Cancel button clicks', () => {
      render(<ProductDashboard />);
      const addButton = screen.getByRole('button', { name: /Add Product/i });

      fireEvent.click(addButton);
      expect(screen.getByTestId('product-form')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);
      expect(screen.queryByTestId('product-form')).not.toBeInTheDocument();

      fireEvent.click(addButton);
      expect(screen.getByTestId('product-form')).toBeInTheDocument();
    });

    test('should maintain correct state when products update', () => {
      const { rerender } = render(<ProductDashboard />);

      useProductContext.mockReturnValue({
        products: [...mockProducts, { id: 4, productName: 'Product 4', productPrice: 40 }],
        message: null,
        clearMessage: mockClearMessage,
      });

      rerender(<ProductDashboard />);

      expect(screen.getByText('Product 4')).toBeInTheDocument();
    });
  });
});
