import { useState } from "react";
import { useProductContext } from "../context/ProductContext";

export default function ProductCard({ product }) {
    const { updateProduct, deleteProduct } = useProductContext();
    const [isEdit, setIsEdit] = useState(false);
    const [productName, setProductName] = useState(product.productName)
    const [productPrice, setProductPrice] = useState(product.productPrice)


    //function call after click update button
    const saveProductData = async () => {
    await updateProduct(product.id, { productName, productPrice: Number(productPrice) })
        setIsEdit(false)
    }
    return (
        <div className="item">
            {isEdit ? (
                <>
                    <input className="input" value={productName} onChange={e => setProductName(e.target.value)} />
                    <input className="input" value={productPrice} onChange={e => setProductPrice(e.target.value)} />
                    <div className="item-actions">
                        <button className="btn" onClick={saveProductData} >Save</button>
                        <button className="btn btn-secondary" onClick={() => setIsEdit(false)}>Cancel</button>
                    </div>
                </>
            ) : (<>
                <div className="item-content">
                    <div className="item-field">
                        <span className="label">Name:</span>
                        <span className="value">{product.productName}</span>
                    </div>
                    <div className="item-field">
                        <span className="label">Price:</span>
                        <span className="value">${Number(product.productPrice).toFixed(2)}</span>
                    </div>
                </div>
                <div className="item-actions">
                    <button className="btn btn-edit" onClick={() => setIsEdit(true)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>X</button>
                </div>
            </>)
            }
        </div>
    )
}