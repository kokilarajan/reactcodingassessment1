
import Header from './components/Header';
import Footer from './components/Footer';
import ProductDashboard from "./components/ProductDashboard";
import { ProductProvider } from "./context/ProductContext";
import './styles/main.scss';

function App() {
  return (
    <div className="App">
      <ProductProvider >
        <Header />
        <ProductDashboard />
        <Footer />
      </ProductProvider>
    </div>
  );
}

export default App;
