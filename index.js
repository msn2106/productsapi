const express = require("express");
const products = require("./products.json");
const fs = require("fs");
const { randomUUID } = require("crypto");
const app = express();

app.use(express.json());

const PORT = 8080;

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.get("/products", (req, res) => {
  const html = `
  <ul>
    ${products.map((product, index) => `<li>${product.productName}</li>`).join("")}
  </ul>
  `;
  res.status(200).send(html);
});

// REST APIs
app.get("/api/products", (req, res) => {
  return res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((x) => x.id === Number(id));
  if (!product)
    return res.json({
      error: `No Product found with id ${id}`,
    });
  return res.json(product);
});

app.post("/api/products", (req, res) => {
  const body = req.body;
  products.push({ id: products.length + 1, ...body, productPrice: parseFloat(body.productPrice) });
  fs.writeFile("./products.json", JSON.stringify(products), (err, data) => {
    console.log(`${err} occurred while writing data to file`);
    return res.json({
      status: 200,
      message: `Product added successfully with id ${products.length}`,
    });
  });
});

app.put("/api/products/:id", (req, res) => {
  let id = Number(req.params.id);
  const body = req.body;
  const finalproducts = products.filter((x) => x.id !== id);
  finalproducts.push({ id: id, ...body, productPrice: parseFloat(body.productPrice) });
  fs.writeFile("./products.json", JSON.stringify(finalproducts), (err, data) => {
    console.log(`${err} occurred while writing data to file`);
    return res.json({
      status: 200,
      message: `Product with id ${id} Updated/Created successfully`,
    });
  });
});

app.patch("/api/products/:id", (req, res) => {
  let id = Number(req.params.id);
  if (!products.find((x) => x.id === id)) {
    return res.json({
      status: 404,
      message: `Product with id ${id} Not Found`,
    });
  }
  const body = req.body;
  const finalproducts = products.filter((x) => x.id !== id);
  finalproducts.push({ id: id, ...body, productPrice: parseFloat(body.productPrice) });
  fs.writeFile("./products.json", JSON.stringify(finalproducts), (err, data) => {
    console.log(`${err} occurred while writing data to file`);
    return res.json({
      status: 200,
      message: `Product with id ${id} Updated successfully`,
    });
  });
});

app.delete("/api/products/:id", (req, res) => {
  let { id } = req.params;
  const tempProducts = products.filter((x) => x.id !== Number(id));
  console.log(tempProducts);
  fs.writeFile("./products.json", JSON.stringify(tempProducts), (err, data) => {
    console.log(`${err} occurred while writing data to file`);
    return res.json({
      status: 200,
      message: `Product with id ${id} Deleted successfully`,
    });
  });
});

app.listen(PORT, () => {
  console.log(`API is running on PORT ${PORT}`);
});
