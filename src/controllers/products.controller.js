import { Product } from "../models/product.model.js"

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({_id: -1})

    res.json ({
      success: true,
      data: products 
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false, 
      error: error.message 
    })
  }
}

const createProduct = async (req, res) => {
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
      user: req.user._id
    })

    res.status(201).json ({ success: true, data: newProduct })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const updates =req.body
    const userId = req.user._id

    const updatedProduct = await Product.findByIdAndUpdate(
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
      return res.status(500).json({ success: false, error: error.message})
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const deletedProduct = await Product.findByIdAndDelete({
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
    if (error.kind === "ObjectId") {
      return res
      .status(400)
      .json({ success: false, error: "ID incorrecto"})
    }

    res.status(500).json({ success: false, error: error.message})
  }
}

export { getProducts, createProduct, updateProduct, deleteProduct }