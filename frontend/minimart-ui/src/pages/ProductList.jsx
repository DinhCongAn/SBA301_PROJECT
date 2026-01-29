// src/pages/ProductList.jsx
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading products...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 MiniMart - Product List</h1>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stockQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;
