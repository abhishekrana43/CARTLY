import {motion} from "framer-motion"
import { useCartStore } from "../stores/useCartStore"
import { Link } from "lucide-react";
import { MoveRight } from "lucide-react";
import {loadStripe} from "@stripe/stripe-js"
import axios from "../lib/axios.js";

const stripePromise = loadStripe
("pk_test_51SvuiM1mqjNqdCqX1XCM4VuFOPlV45yqMeWfGCe3iGCPWPYMv79wAYXlNUkJ0xvWJgjbuSvHx1fTBRtZhZAUOSPp00VBZHkUNy");

const OrderSummary = () =>{
    const {total, subtotal, isCouponApplied, cart} = useCartStore();

    const saving = subtotal - total;
    const formattedSubtotal = subtotal.toFixed();
    const formattedTotal = total.toFixed();
    const formattedSaving = saving.toFixed();

    const handlePayment = async() =>{
        const stripe = await stripePromise;
        await axios.post("/payments/create-checkout-session", {
            products:cart,
            coupon: coupon ? coupon.code: null
        });
        const session = res.data;
        
    }
    return <motion.div
    className="space-y-4 rounded-lg border-gray-700 bg-gray-800 shadow-sm sm:p-6"
    initial={{opacity:0, y:20}}
    animate={{opacity:1, y:0}}
    transition={{duration: 0.5}}>

        <p className="text-xl font-semibold text-emerald-400">Order summary</p>

        <div className="space-y-4">
            <div className="space-y-2">
                <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-300">Original price  </dt>
                        <dd className="text-base font-medium text-white">${formattedSubtotal}</dd>
                </dl>

                {saving > 0 && (
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gary-400">savings</dt>
                        <dd className="text-base font-medium text-emerald-400">-${formattedSaving}</dd>
                    </dl>
                )}

                {coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
                    </dl>
            </div>
        </div>

    </motion.div>
};

export default OrderSummary