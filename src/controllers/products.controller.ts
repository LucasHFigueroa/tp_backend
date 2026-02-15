import { Product } from "../models/product.model"
import { Request, Response } from "express"
import { productValidate, productPartialValidate } from "../validators/productValidator"

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ user: req.user!._id }).sort({_id: -1})

    res.json ({
      success: true,
      data: products 
    })
  } catch (error) {
    const err = error as Error
    console.error(err)
    res.status(500).json({
      success: false, 
      error: err.message 
    })
  }
}

const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, category, description } = req.body

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: "Nombre obligatorio. Datos inválidos"
      })
    }

    const newProduct = await Product.create ({
      name, 
      price, 
      stock, 
      category, 
      description,
      user: req.user!._id
    })

    res.status(201).json ({ success: true, data: newProduct })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates =req.body
    const userId = req.user!._id

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, user: userId },
      updates,
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado o no tienes permiso para editarlo"
      })
    }
    res.json({ success: true, data: updatedProduct})
  } catch (error) {
    const err = error as Error
    return res.status(500).json({ success: false, error: err.message})
  }
}

const deleteProduct = async (req: Request, res: Response) => {

  try {
    const { id } = req.params
    const userId = req.user!._id
    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      user: userId 
    })

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado o no tienes permiso para eliminarlo"
      })
    }
    res.json({ 
      success:true, 
      message: "Producto eliminado correctamente", 
      data: deletedProduct
    })
  } catch (error) {
    const err = error as Error
    if (err.kind === "ObjectId") {
      return res
      .status(400)
      .json({ success: false, error: "ID incorrecto"})
    }

    res.status(500).json({ success: false, error: error.message})
  }
}

export { getProducts, createProduct, updateProduct, deleteProduct }