import { stripe } from "../lib/stripe.js";
import Coupan from "../models/coupan.model.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req,res) =>{
    try {
        const {products,coupanCode} = req.body;

        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({error:"Inavlid or empty products array"});

        }
        let totalAmount= 0;
        const lineIteams = products.map(product => {
          const amount = Math.round(product.price *100);
          totalAmount += amount * product.quantity

          return {
            price_data:{
                currency:"usd",
                product_data:{
                    name:product.name,
                    images:[product.image],

                },
                unit_amount:amount
            }
          }
        });
        let coupan = null;
if(coupan){
    coupan =await Coupan.findOne({code:coupanCode, userId:req.user._id, isActive:true});
    if(coupan){
        totalAmount -= Math.round(totalAmount * coupan.discountPercentage/100)
    }

}
const session = await stripe.checkout.session.create({
    payment_method_types:["card"],
    line_iteams:lineIteams,
    mode:"payment",
    success_url:`${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:`${process.env.CLIENT_URL}/purchase-cancel`,
    discount: coupan 
    ? [
        {
            coupan : await createStripeCoupan(coupan.discountPercentage),

        },
    ]
    :[],  
    metadata:{
        userId:req.user._id.toString(),
        coupanCode:coupanCode || "",
        products:JSON.stringify(
            products.map((p) =>({
                id:p._id,
                quantity:p.quantity,
                price:p.price,

            }))
        ),
    },
});
    } catch (error) {
        
    }
};

export const checkoutSuccess = async(req,res) =>{
    try {
        const {sessionId} = req.body;
        const session = await stripe.checkout.session.retriver(sessionId);

        if(session.payment_status === "paid"){
            await Coupan.findOneAndUpdate({
               code: session.metadata.coupanCode, userId: session.metadata.userId 
            }, {
                isActive:false
            })
        }

        // create a new order
        const products = JSON.parse(session.metadata.products);
        const newOrder = new Order({
            user:session.metadata.userId,
            products: products.map(product => ({
            product: product.id,
            quantity: product.quantity,
            price: product.price
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId
    })

    await newOrder.save();
    res.status(200).json({
        success:true,
        message:"Payment successful, order created, and coupan deactivated if used.",
        odredId: newOrder._id,

    })
    } catch (error) {
       console.error("Error processing successful checkout:", error);
       res.status(500).json({message:"Error processing successful checkout", error: error.message}); 
    }
}

async function createStripeCoupan(discountPercentage) {
    const coupan = await stripe.coupan.create({
        percent_off:discountPercentage,
        duration:"once",
    });
    if(totalAmount >= 20000){
        await createNewCoupan(req.user._id)
    }
    res.status(200).json({id:session.id, totalAmount: totalAmount / 100});
    return coupan.id;
}

async function createNewCoupan(userId) {
    const newCoupan = new Coupan({
        code:"GET" + Math.random().toString(2,8).toUpperCase(),
        discountPercentage:18,
        expirationDate: new Date(date.now() +30 * 24 * 60 * 60 * 1000),
        userId:userId
    })

    await newCoupan.save();
    return newCoupan
}

