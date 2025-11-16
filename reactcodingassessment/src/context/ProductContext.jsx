import React,{createContext,useContext,useReducer,useEffect} from "react";
import * as api from "../api/productDataApi";
import productReducer,{initialState} from "./productReducer";

const ProductContext=createContext();


export function ProductProvider({children}){
    const [state,dispatch]=useReducer(productReducer,initialState)
    console.log(productReducer,initialState,"productReducer")

    useEffect(()=>{
        fetchProductData();
    },[])


    //fetch product data from api
    const fetchProductData=async()=>{
        const data=await api.getProductData()
        console.log(data,"data")
        dispatch({type:"SET_PRODUCT_DATA",payload:data})
    }
    //add product data to api
    const addProduct=async(product)=>{
        const data= await api.addProductData(product);
        dispatch({type:"ADD_PRODUCT_DATA",payload:data})
    }
    //update product data to api
    const updateProduct=async(id,product)=>{
        const data=await api.updateProductData(id,product);
        dispatch({type:"UPDATE_PRODUCT_DATA",payload:data})
    }
    //delete product data from api
    const deleteProduct=async(id)=>{
        await api.deleteProductData(id);
        dispatch({type:"DELETE_PRODUCT_DATA",payload:id})
    }
    // clear message
    const clearMessage = () => {
        dispatch({ type: "SET_MESSAGE" });
    }
    return(
        <ProductContext.Provider value={{...state,addProduct,updateProduct,deleteProduct,clearMessage}}>{children}</ProductContext.Provider>
    )
}
export const useProductContext=()=>useContext(ProductContext);