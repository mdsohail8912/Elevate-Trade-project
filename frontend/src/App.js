import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const App = () => {
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [increment, setIncrement] = useState('');
  const [intervalDays, setIntervalDays] = useState('');
  const [searchName, setSearchName] = useState('');
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('add'); // Toggle between 'add', 'search', and 'all'

  // Fetch products based on searchName or fetch all products
  const fetchProducts = async (searchTerm = '') => {
    try {
      const response = await axios.get('http://localhost:5050/product/search', {
        params: { name: searchTerm }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle form submission to add a new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5050/product', {
        name,
        basePrice: parseFloat(basePrice),
        increment: parseFloat(increment),
        intervalDays: parseInt(intervalDays),
      });
      setName('');
      setBasePrice('');
      setIncrement('');
      setIntervalDays('');
      setView('view'); // Switch to view mode after adding a product
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // Handle delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/product/${id}`);
      setProducts(products.filter(product => product._id !== id)); // Remove the deleted product from the state
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    if (view === 'view' || view === 'search') {
      fetchProducts(searchName);
    } else if (view === 'all') {
      fetchProducts();
    }
  }, [view, searchName]);

  // Helper function to safely format numbers
  const formatNumber = (num) => {
    return typeof num === 'number' ? num.toFixed(2) : '0.00';
  };

  return (
    <div className="app-container">
      <h1>Product Price Manager</h1>
      <div className="toggle-buttons">
        <button 
          onClick={() => setView('add')} 
          className={`toggle-button ${view === 'add' ? 'active' : ''}`}
        >
          Add Product
        </button>
        <button 
          onClick={() => setView('search')} 
          className={`toggle-button ${view === 'search' ? 'active' : ''}`}
        >
          Search Products
        </button>
        <button 
          onClick={() => setView('all')} 
          className={`toggle-button ${view === 'all' ? 'active' : ''}`}
        >
          View All Products
        </button>
      </div>

      {view === 'add' ? (
        <div className="form-container">
          <h2>Add New Product</h2>
          <form className="product-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Base Price"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Increment"
              value={increment}
              onChange={(e) => setIncrement(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Interval Days"
              value={intervalDays}
              onChange={(e) => setIntervalDays(e.target.value)}
              required
            />
            <button type="submit">Create Product</button>
          </form>
        </div>
      ) : (
        <div className="products-view">
          {view === 'search' && (
            <>
              <h2>Search Products</h2>
              <input
                type="text"
                placeholder="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </>
          )}
          {view === 'all' && <h2>All Products</h2>}
          <div className="products-container">
            {products.length > 0 ? (
              products.map(p => (
                <div className="product-card" key={p._id}>
                  <h3>{p.name}</h3>
                  <p><strong>Base Price:</strong> ${formatNumber(p.basePrice)}</p>
                  <p><strong>Current Price:</strong> ${formatNumber(p.currentPrice)}</p>
                  <p><strong>Increment:</strong> ${formatNumber(p.increment)} every {p.intervalDays} days</p>
                  <p><strong>Last Price Update:</strong> {new Date(p.lastPriceUpdate).toLocaleDateString()}</p>
                  <button 
                    onClick={() => handleDelete(p._id)} 
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
