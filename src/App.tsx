import React, { useState, useMemo, useEffect, ChangeEvent } from "react";
import "./App.css";

// Define types for the product and the image loading state
interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
}

type ImageLoadingState = {
  [key: string]: boolean | "error";
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [debouncedSearchKey, setDebouncedSearchKey] = useState<string>(searchKey);
  const [imageLoading, setImageLoading] = useState<ImageLoadingState>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://1e0ba872-6030-405d-9881-8b7455d2ebdf.mock.pstmn.io/api/v1/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setProducts(jsonData.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchKey(searchKey);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchKey]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(event.target.value);
  };

  const handleImageLoad = (productId: string) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: false,
    }));
  };

  const handleImageError = (productId: string) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: "error",
    }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.productName.toLowerCase().includes(debouncedSearchKey.toLowerCase()));
  }, [debouncedSearchKey, products]);

  return (
    <div className="App">
      <h1>Products List</h1>
      <div className="filter-input">
        <input value={searchKey} type="text" onChange={handleSearchChange} placeholder="Search Products..." aria-label="Search Products" />
      </div>
      <div className="products-container">
        {filteredProducts.map((prod) => (
          <div className="card" key={prod.productId}>
            <div className="image-container">
              {imageLoading[prod.productId] !== false && (
                <div className="placeholder">
                  {imageLoading[prod.productId] === "error" ? (
                    "Image not available"
                  ) : (
                    <div className="spinner-container">
                      <div className="loader-spinner"></div>
                    </div>
                  )}
                </div>
              )}
              <img
                src={prod.productImage}
                alt={`${prod.productName} Image`}
                onLoad={() => handleImageLoad(prod.productId)}
                onError={() => handleImageError(prod.productId)}
                className={`product-image ${imageLoading[prod.productId] === false ? "loaded" : ""}`}
                style={imageLoading[prod.productId] === false ? {} : { display: "none" }}
              />
            </div>
            <div className="name-price-div">
              <div>{prod.productName}</div>
              <div>Price: ${prod.productPrice}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
