import { Request, Response } from "express"
import { Product } from "../models/product.model"
import mongoose from "mongoose"
import { productPartialValidate, productValidate } from "../validators/productValidator"

const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, tags } = req.query

    const filter: Record<string, any> = {}

    if (category) {
      filter.category = { $regex: category as string, $options: "i" }
    }

    if (tags) {
      filter.tags = { $in: [tags as string] }
    }

    const products = await Product.find(filter).sort({ _id: -1 })
    res.json({ success: true, data: products })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

const createProduct = async (req: Request, res: Response) => {
  try {
    const validate = productValidate.safeParse(req.body)

    if (!validate.success) {
      return res.status(400).json({ success: false, error: validate.error.flatten().fieldErrors })
    }

    const { name, price, stock, category, description, image, tags } = req.body

    const createdProduct = await Product.create({
      name, price, stock, category, description, image,
      tags: tags || [],
      user: req.user!._id
    })

    res.status(201).json({ success: true, data: createdProduct })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

const updateProduct = async (req: Request, res: Response) => {
  try {
    const id      = req.params.id
    const updates = req.body
    const userId  = req.user!._id

    const validate = productPartialValidate.safeParse(updates)

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        error: validate.error.flatten().fieldErrors
      })
    }

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

    res.json({ success: true, data: updatedProduct })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id     = req.params.id as string
    const userId = req.user!._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID incorrecto, ingresa un valor válido"
      })
    }

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
      success: true,
      message: "Producto eliminado correctamente",
      data: deletedProduct
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

export { getProducts, createProduct, updateProduct, deleteProduct }