import Coupan from "../models/coupan.model.js"

export const getCoupan= async(req,res) =>{
    try {
        const coupan = await Coupan.findOne({userId:req.user._id, isActive:true});
        res.json(coupan || null);

    } catch (error) {
        console.log("Error in getCoupan controller", error.message);
        res.status(500).json({message:"Server error", error:error.message});
    }
};

export const validateCoupan = async(req,res) =>{
    try {
        const {code} = req.body;
        const coupan = await Coupan.findOne({code:code, userId:req.user._id, isActive:true});
        if(!coupan){
            return res.status(404).json({message:"Coupan not found"});

        }
        if(coupan.expirationDate < new Date()){
            coupan.isActive = false;
            await coupan.save();
            return res.status(404).json({message:"Coupan expired"});
    
        }
        res.json({
            message:"Coupan is valid",
            code:coupan.code,
            discountPercentage: coupan.discountPercentage,
        })
    } catch (error) {
       console.log("Error in validateCoupan controller", error.message);
       res.status(500).json({message:"Server error", error:error.message}); 
    }
}