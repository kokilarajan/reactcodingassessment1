import { useState } from "react";
import { useProductContext } from "../context/ProductContext";



export default function ProductForm({ onClose }) {
    const { addProduct } = useProductContext();
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [showError, setShowError] = useState(null);

    //function call after click Add button
    const handleSubmit = async (e) => {
        e.preventDefault()
     
        if (!productName.trim()) return setShowError("Product Name is required");
        if (productPrice === "" || productPrice === null) return setShowError("Product Price is required");
        const priceNumber = Number(productPrice);
        if (Number.isNaN(priceNumber) || priceNumber < 0) return setShowError("Product Price must be a positive number");

        await addProduct({ productName: productName.trim(), productPrice: priceNumber })
        setProductName("");
        setProductPrice("");
        setShowError(null)
        if (onClose) onClose();
    }



    return (
        <form onSubmit={handleSubmit} className="form">
             {showError && <p role="alert" className="error">{showError}</p>}
            <div className="form-row">
                <input className="input" placeholder="Enter Product Name" value={productName} onChange={e => setProductName(e.target.value)} aria-label="product-name" />
                <input className="input" placeholder="Price" value={productPrice} onChange={e => setProductPrice(e.target.value)} aria-label="product-price" />
                <button className="btn" type="submit">Add</button>
            </div>

           
        </form>
    )
}