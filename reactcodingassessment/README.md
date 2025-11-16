Project overview


--Listing products
--editing and deleting products
--API data handled by json server
--Adding Products with form validation
--State management through Context and reducer pattern


Setup Dependencies

--npm install

Run the mock server to run and call the data from db.json
Open the terminal
--npm run mock:server(running at port given at http://localhost:4000/products)


start the React application in another terminal
---npm run start

Run the test suite
--npm run test


Code structure
--src
  ---productDataApi.js(API calling for get,update,add and delete)
 components(React Components) 
 --Footer.jsx(Footer component)
 --Header.jsx(Header Component)
--productCard (UI showing Each Product item having productname,price with edit and cancel functionality)
--ProductDashboard.jsx(having products title and Add product button )
--productForm.jsx(Add product Form with Validation)
---context/
 ----ProductContext(Context +Reducer Logic for CRUD operations)
 --productReducer.js(actions)

 --styles/
 ---_variables.scss(variables declared)
 ---header.scss(styles for header component)
 ---main.scss(main styles)

 --State Flow
 ---Starts from ProductProvider in productContext.jsx
 performs the initial fetch and exposes `products`, `addProduct`, `updateProduct`, `deleteProduct`, and `clearMessage` to the UI.
 - The reducer (`productReducer.js`) handles actions such as `SET_PRODUCT_DATA`, `ADD_PRODUCT_DATA`, `UPDATE_PRODUCT_DATA`, `DELETE_PRODUCT_DATA`, and `SET_MESSAGE`.


 Design choices

 - Context + Reducer: chosen for simplicity and to avoid adding a heavier state library for this assessment.
 - Client-side pagination: implemented in `ProductDashboard.jsx` (slices the products array). This keeps the UI responsive without changing the mock API.
 - SCSS: small set of SCSS files, variables and media queries used for responsive design.
 - Validation: `ProductForm` validates that the product name and price are present and that price is numeric before calling `addProduct`.




