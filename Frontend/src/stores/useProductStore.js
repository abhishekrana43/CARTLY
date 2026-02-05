import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const usePorductStore = create((set) => ({
    products:[],
    loading:false,

    setProducts: (products) =>set({products}),

    createProduct: async(productData) =>{
        set({loading:true});
        try {
            const res = await axios.post("/products", productData);
            set((prevStore) => ({
                productData: [...prevStore.products, res.data],
                loading:false,
            }));
        } catch (error) {
            toast.error(error.response.data.error);
            set({loading:false});
        }
    },
    
    fetchAllProducts: async() =>{
        set({loading:false});
        try {
            const response = await axios.get("/products");
            set({products: response.data.products, loading:false});

        } catch (error) {
            set({error: "Failed to fetch products", loading:false});
            toast.error(error.response.data.error || "Failed to fetch products");

        }
    },
    deleteProduct: async() =>{
       set({loading:false});
       try {
        const response = await axios.patch(`/products/${productId}`);

        set((prevProducts) =>({
            products: prevProducts.productData.map((product) =>
            product._id === productId ? {...product, isFeatured: response.data.isFeatured} : product),
            loading: false,
        }))
       } catch (error) {
        
       } 
    },
    toggleFeaturedProduct: async (id) =>{},

}));