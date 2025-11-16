export const initialState = {
    products: [],
    message: null
}

export default function productReducer(state, action) {
    console.log(state,action,"redcers")
    switch (action.type) {
        case "SET_PRODUCT_DATA":
            return { ...state, products: action.payload };
        case "ADD_PRODUCT_DATA":
            return {
                ...state,
                products: [...state.products, action.payload],
                message: "Product Data Added"
            };
        case "UPDATE_PRODUCT_DATA":
            return {
                ...state,
                products: state.products.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                ),
                message: "Product Data Updated"
            };
        case "DELETE_PRODUCT_DATA":
            return {
                ...state,
                products: state.products.filter((product) => product.id !== action.payload),
                message: "Product Data Deletedd"
            }
        case "SET_MESSAGE":
            return {
                ...state,
                message: null
            };
        default:
            return state
    }
}