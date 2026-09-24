import useCartStore from "../store/cartstore"

function ProductCard({ product }) {
  const addToCart = useCartStore(
    (state) => state.addToCart
  )

  return (
    <div className="border p-4 rounded">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain"
      />

      <h2 className="font-bold mt-3">
        {product.title}
      </h2>

      <p className="mt-2">
        ${product.price}
      </p>

      <p className="text-sm mt-1">
        {product.category}
      </p>

      <button
        onClick={() => addToCart(product)}
        className="border p-2 rounded mt-3"
      >
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard