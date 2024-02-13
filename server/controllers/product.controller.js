import Product from '../models/product.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'
const create = async (req, res) => { 
const product = new Product(req.body) 
try {
await product.save()
return res.status(200).json({ 
message: "Successfully Added!"
})
} catch (err) {
return res.status(400).json({
error: errorHandler.getErrorMessage(err) 
})
} 
}
const list = async (req, res) => { 
try {
let product = await Product.find().select('name description price quantity category') 
res.json(product)
} catch (err) {
return res.status(400).json({
error: errorHandler.getErrorMessage(err) 
})
} 
}
const productByID = async (req, res, next, id) => { 
    try {
        let product = await Product.findById(id) 
        if (!product)
        return res.status('400').json({ 
    error: "Product not found"})
    req.profile = product 
    next()
} catch (err) {
    return res.status('400').json({ 
        error: "Could not retrieve product"
    }) 
}
}
const read = (req, res) => {
req.profile.hashed_password = undefined 
req.profile.salt = undefined
return res.json(req.profile) 
}
const update = async (req, res) => { 
try {
let product = req.profile
product = extend(product, req.body) 
product.updated = Date.now() 
await product.save()
product.hashed_password = undefined 
product.salt = undefined
res.json(product) 
} catch (err) {
return res.status(400).json({
error: errorHandler.getErrorMessage(err) 
})
} 
}
const remove = async (req, res) => { 
    try {
        let product = req.profile
        let deletedProduct = await product.deleteOne() 
        deletedProduct.hashed_password = undefined 
        deletedProduct.salt = undefined
        res.json(deletedProduct) 
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err) 
        })
    } 
};

const removeAll = async(req, res)=>{
    try{
        const deletedProducts = await Product.deleteMany();
        if(deletedProducts.deletedCount === 0){
            return res.status(404).json({error: 'No products found'});
        }
        res.json({message: 'All products removed!'})
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};


export default { create, productByID, read, list, remove, removeAll, update}

