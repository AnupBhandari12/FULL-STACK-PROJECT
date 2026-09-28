import express from "express";

const app = express()
app.use(express.json())

const PORT = 3000;

const items = [
    {
        id: 1,
        name: "Laptop",
        price: 80000
    },
    {
        id: 2,
        name: "Mouse",
        price: 1500
    }
]


app.get("/", (req, res) => {
    res.json({
        message: "API is running"
    })
})

app.get("/items", (req, res) => {
    res.json(items)
})

app.get("/items/:id", (req, res) => {
    const id = Number(req.params.id)

    const item = items.find((item) => item.id === id)

    if (!item) {
        return res.status(404).json({
            message: "Item not found"
        })
    }
    res.json(item)
})

app.post("/items", (req, res) => {
    const { name, price } = req.body

    const newItem = {
        id: items.length + 1,
        name,
        price
    }


    if (
        typeof name !== "string" ||
        name.trim() === "" ||
        typeof price !== "number" ||
        price <= 0
    ) {
        return res.status(400).json({
            message: "Valid name and price are required"
        })
    }

    items.push(newItem)

    res.status(201).json(newItem)

})

app.patch("/items/:id", (req, res) => {
    const id = Number(req.params.id)

    const item = items.find((item) => item.id === id)

    if (!item) {
        return res.status(404).json({
            message: "Item not found"
        })
    }

    const { name, price } = req.body

    if (name !== undefined) {
        item.name = name
    }

    if (price !== undefined) {
        item.price = price
    }

    res.json(item)
})

app.delete("/items/:id", (req, res) => {
    const id = Number(req.params.id)

    const itemIndex = items.findIndex((item) => item.id === id)

    if (itemIndex === -1) {
        return res.status(404).json({
            message: "Item not found"
        })
    }

    items.splice(itemIndex, 1)

    res.json({
        message: "Item deleted successfully"
    })
})

app.get("/test-error", (req, res, next) => {
  const error = new Error("Something went wrong")

  next(error)
})
app.use((error , req , res , next) => {
    res.status(500).json({
        message: error.message
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})