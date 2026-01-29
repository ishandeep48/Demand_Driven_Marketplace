import express, { Request, Response } from "express";
const router = express.Router();
import Product from "../models/Products";

interface productData {
  name: string;
  basePrice: number;
  stock: number;
  category: string;
  maxQuantity?: Number;
}

router.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res
      .status(200)
      .json({ code: "OK", message: "Done", data: products });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ code: "ERR", message: "Some error on our end" });
  }
});

router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({
          code: "NOT_FND",
          message: "No Product with matching ID in our database",
        });
    }
    return res.status(200).json({ code: "OK", message: "Done", data: product });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ code: "ERR", message: "Some error on our end" });
  }
});

router.post("/add-product", async (req: Request, res: Response) => {
  try {
    const data: productData = req.body;
    if (!data.name || !data.basePrice || !data.stock || !data.category) {
      return res.status(400).json({
        code: "BAD_REQ",
        message: "name, basePrice, stock, and category are required fields",
      });
    }
    const product = new Product({
      name: data.name,
      basePrice: data.basePrice,
      currentPrice: data.basePrice,
      stock: data.stock,
      category: data.category,
      maxQuantity: data.maxQuantity || 5,
    });
    await product.save();
    return res.status(201).json({
      code: "OK",
      message: "Done",
      data: product,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ code: "ERR", message: "Some error on our end" });
  }
});

export default router;
