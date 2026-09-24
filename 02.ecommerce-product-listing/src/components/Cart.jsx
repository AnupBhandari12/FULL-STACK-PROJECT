import useCartStore from "../store/cartstore"

function Cart() {
  const cart = useCartStore((state) => state.cart)

  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  )

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  )

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  )

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  )

  return (
    <div className="border p-4 rounded mt-6">

      <h2 className="text-2xl font-bold">
        Cart ({totalItems})
      </h2>

      {cart.length === 0 && (
        <p className="mt-3">
          Cart is empty
        </p>
      )}

      {cart.map((item) => (
        <div
          key={item.id}
          className="border p-3 rounded mt-3"
        >
          <h3 className="font-bold">
            {item.title}
          </h3>

          <p>
            ${item.price}
          </p>

          <p>
            Quantity: {item.quantity}
          </p>

          <button
            onClick={() =>
              decreaseQuantity(item.id)
            }
            className="border p-2 rounded mr-2"
          >
            -
          </button>

          <button
            onClick={() =>
              increaseQuantity(item.id)
            }
            className="border p-2 rounded"
          >
            +
          </button>

          <button
            onClick={() =>
              removeFromCart(item.id)
            }
            className="border p-2 rounded ml-2"
          >
            Remove
          </button>
        </div>
      ))}

      <h3 className="font-bold mt-4">
        Total: ${totalPrice.toFixed(2)}
      </h3>

    </div>
  )
}

export default Cart