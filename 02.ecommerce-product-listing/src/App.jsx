import { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart.jsx"


function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category , setCategory] = useState("all");
  const [sortOrder , setSortOrder] = useState("default");
  const [maxPrice , setMaxPrice] = useState(1000);
  const [currentPage , setCurrentPage] = useState(1);


  const categories = [
    "all",
    ...new Set(products.map((product) => product.category))
  ]

  const filteredProduct = products.filter((product) => {
    const matchesCategory = category === "all" ||  product.category === category

    const matchesPrice = product.price <= maxPrice

    return matchesCategory && matchesPrice
  })
  const sortedProducts = [...filteredProduct].sort((a,b) => {
    if(sortOrder === "low-high"){
      return a.price - b.price
    }

    if(sortOrder === "high-low"){
      return b.price - a.price 
    }

    return 0
  })

  const productsPerPage = 6

  const totalPages = Math.ceil(
    sortedProducts.length / productsPerPage
  )

  const startIndex = (currentPage -1) * productsPerPage

  const currentProducts = sortedProducts.slice(
    startIndex, startIndex +productsPerPage
  )


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        console.log(data);

        setProducts(data);
      } catch (error) {
        console.log(error);

        setError("something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">E - commerce Product Listing</h1>

      <Cart/>

      <div className="mt-4">
        <label>
          Max Price : ${maxPrice}
        </label>
        <input
        type="range"
        min="0"
        max="1000"
        value={maxPrice}
        onChange={(e) => {setMaxPrice(Number(e.target.value))
          setCurrentPage(1)
        }}
        className="ml-2"
        />
      </div>

      <select 
      value={category}
      onChange={(e) => {setCategory(e.target.value)
        setCurrentPage(1)
      }}
      className="border p-2 rounded mt-4"
      >

      {categories.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
      </select>

      <select value={sortOrder}
      onChange={(e) => {setSortOrder(e.target.value)
        setCurrentPage(1)
      }}
      className="border p-2 rounded mt-4 ml-2"
      >
        <option value="default">Default</option>
        <option value="low-high">Price : Low to High</option>
        <option value="high-low">Price : High to Low</option>
      </select>

      {loading && <p className="mt-4">Loading Products...</p>}

      {error && <p className="mt-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {currentProducts.map((product) => (
          <ProductCard
          key={product.id}
          product={product}
          />
        ))}
      </div>

      <div className="mt-6 flex gap-2 items-center">
        <button onClick={()  => setCurrentPage((prev) => Math.max(prev -1 , 1))} disabled={currentPage ===1} className="border p-2 rounded">
          Previous
        </button>

        <p>
          Page{currentPage} of {totalPages}
        </p>
        <button className="border p-2 rounded" onClick={() => setCurrentPage((prev) => Math.min(prev +1 , totalPages))}disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
