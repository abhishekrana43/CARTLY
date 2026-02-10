import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

const PeopleAlsoBought = () =>{
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async ()=>{
        try {
             const res = await axios.get("/products/recommendations")
            setRecommendations(res.data);
        } catch (error) {
            toast.error(error.response.data.message || "An error occured");
        } finally{
            setIsLoading(false);
        } 
        };
        fetchRecommendations();
    }, [])
    return <div className="mt-8">

       <h3 className="text-2xl font-semibold text-emerald-400">
    People also bought
 </h3>
 <div className="mt-6 grid gap-4 sm:grid-cols-2 lg: grid-cols-2">
    {recommendations.map((product) =>(
        <ProductCard key={product._id} product={product} />

    ))}
 </div>
 </div>
}
export default PeopleAlsoBought