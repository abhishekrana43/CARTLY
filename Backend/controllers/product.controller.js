import { redis } from "../lib/redis.js";
import Product from "../models/products.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async(req,res) =>{
    try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

export const getFeaturedProducts =async (req,res)=>{
    try {
        let featuredProducts = await redis.get("featured_products");
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts));
        }


        //.lean() return a plain javascript object instead of mongodb document
        featuredProducts = await Product.find({isfeatured:true}).lean();

        if(!featuredProducts){
            return res.status(404).json({message:"No Featured products found"});

        }

        await redis.set("featured_products",JSON.stringify(featuredProducts));

        res.json(featuredProducts);

    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({message:"Server error", error:error.message});
    }
}

export const createProduct = async(req,res)=>{
    try {
        const {name,description,price,image,category}= req.body;

        let cloudinaryResponse = null

        if(image){
            await cloudinary.uploader.upload(image,{folder:"products"})

        }
        const product = await Product.create({
            name,
            description,
            price,
            impage: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url :"",
            category,
        });

        res.status(201).json(product);

    } catch (error) {
       console.log("Error in createProduct controller", error.message);
       res.status(500).json({message:"Server error", error:error.message});
    }
}

export const deleteProduct = async(req,res) =>{
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({message:"Product not found"});

        }
        if(product.image){
           const publicId = product.image.split("/").pop().split(".")[0];
           try {
            await cloudinary.uploader.destroy(`product/${publicId}`);
            console.log("delete image from cloudinary");
           } catch (error) {
            console.log("error deleting image from cloudinary", error);
           } 
        }

        await Product.findByIdAndDelete(req.params.id)
        res.json({message:"Product deleted successfully"});

    } catch (error) {
       console.log("Error in deleteProduct controller", error.message );
       res.status(500).json({message:"Server error", error:error.message});
    }
}

export const getRecommendedProducts = async(req,res)=>{
    try {
        const products= await Product.aggregate([
            {
              $sample:{
                _id:1,
                name:1,
                description:1,
                image:1,
                price:1
              }  
            }
        ])
        res.json(products);

    } catch (error) {
       console.log("Error in getRecommendedProducts controller", error.message);
       res.status(500).json({message:"Server error", error:error.message}); 
    }
}

export const getProductByCategory = async (req,res) =>{
    const {category} = req.params;
    try {
        const products = await Product.find({category});
        res.json(products);
    } catch (error) {
        console.log("Error in getProductByCategory controller", error.message);
        res.status(500).json({message:"Server Error", error:error.message});
    }
};

export const toggleFeatureProduct = async(req,res) =>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeature = !product.save();
            const updateFeatureProduct = await product.save();
            await updateFeatureProductsCache();
            res.json(updateFeatureProduct);
        
        }
        else{
            res.status(404).json({message:"Product not found"});

        }
    } catch (error) {
        console.log("Error in toggleFeatureProduct controller", error.message);
        res.status(500).json({message:"Server error", error:error.message});
    }
}

async function updateFeatureProductsCache() {
    try {
        const featuredProducts = await Product.find({isFeature:true}).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
}
catch (error) {
     console.log("Error in update feature function");   
    }
}