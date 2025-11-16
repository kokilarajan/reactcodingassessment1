import axios from 'axios';
const API="http://localhost:4000";

export const getProductData=()=>axios.get(`${API}/products`).then((res)=>res.data);
export const addProductData=(product)=> axios.post(`${API}/products`,product).then((res)=>res.data);
export const deleteProductData=(id)=>axios.delete(`${API}/products/${id}`).then((res)=>res.data);
export const updateProductData=(id,product)=>axios.put(`${API}/products/${id}`,product).then((res)=>res.data);