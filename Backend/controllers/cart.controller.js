import Product from "../models/products.model.js";
export const getCartProducts = async(req,res)=>{

      try {
        const products =  await Product.find({_id:{$in:req.user.cartIteams}});

        // add quantity for each product
        const cartIteams = products.map(product => {
            const iteam = req.user.cartIteams.find(cartIteams => cartIteams.id === product.id);
            return {...product.toJSON(), quantity:iteam.quantity};
        }) 
        res.json(cartIteams);

      } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({message:"Server error", error:error.message});
      }
};

export const addToCart= async(req,res)=>{
  try {
    const {productId} = req.body;
    const user = req.user;

    const existingItem = user.cartIteams.find(item => item.id === productId);
    if(existingItem){
        existingItem.quantity +=1;

    }
    else{
        user.cartIteams(productId);
    }

    await user.save();
    res.json(user.cartIteams);

  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({message:"server error", error:error.message});
  }  
};

export const removeAllFromCart = async(req,res) =>{
    try {
        const {productId} = req.body;
        const user = req.user;
        if(!productId){
            user.cartIteams= [];

        }
        else{
            user.cartIteams = user.cartIteams.filter((item) => item.id !== productId);

        }
        await user.save();

    } catch (error) {
        res.status(500).json({message:"Server error", error:error.message});
    }
};

export const updateQuantity = async (req,res) =>{
    try {
        const {id:productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;
        const exisitigIteam = user.cartIteams.filter((item) => item.id !== productId);
        
        if(exisitigIteam){
            if(quantity == 0){
                user.cartIteams = user.cartIteams.filter((iteam) => iteam.id !== productId);
                await user.save();
                return res.json(user.cartIteams);
            }

            exisitigIteam.quantity = quantity;
            await user.save();
            res.json(user.cartIteams)
        }
        else{
            res.status(404).json({message:"Product not found"});

        }
    } catch (error) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({message:"Server error", error:error.message});
    }
};

