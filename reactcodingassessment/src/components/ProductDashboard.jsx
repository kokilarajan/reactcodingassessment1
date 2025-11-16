import { useProductContext } from "../context/ProductContext";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import { useState, useEffect } from "react";
export default function ProductDashboard() {
    const { products, message } = useProductContext();
    const [showForm, setShowForm] = useState(false);
    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = products ? Math.max(1, Math.ceil(products.length / PAGE_SIZE)) : 1;

 
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
        if (currentPage < 1) setCurrentPage(1);
    }, [products, totalPages]);
    const { clearMessage } = useProductContext();
    return (
        <div >
              <h2 style={{alignContent:"center",display:"flex",justifyContent:"center"}}>Products</h2>
            <div className="dashboard-header">
              
                <div className="dashboard-actions">
                    {!showForm ? (
                        <button className="btn" type="button" onClick={() => setShowForm(true)} aria-label="Add Product">Add Product</button>
                    ) : (
                        <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)} aria-label="Cancel">Cancel</button>
                    )}
                </div>
            </div>

            {message && (
                <div role="alert" className="message">
                    <span className="message-text">{message}</span>
                    <div className="message-close-wrapper">
                        <button type="button" className="message-close" aria-label="Close message" onClick={clearMessage}>×</button>
                    </div>
                </div>
            )}

            {showForm && <ProductForm onClose={() => setShowForm(false)} />}

            {products && products.length > 0 ? (
                products
                    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                    .map(pdt => (
                        <ProductCard key={pdt.id} product={pdt} />
                    ))
            ) : (
                <p>No Products Available</p>
            )}


            {products && products.length > PAGE_SIZE && (
                <div className="pagination">
                    <button className="btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button className="btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}

        </div>
    )
}