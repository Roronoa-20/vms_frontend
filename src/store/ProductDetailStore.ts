import { create } from 'zustand';

export type TProductDetails = {
    material_name:string,
    hsnsac_code:string,
    annual_capacity:string,
    material_description:string,
    hse:string,
}

type ProductDetailStore = {
    productDetails:Partial<TProductDetails>[],
    updateProductDetals:(data:any)=>void
    resetProductDetails:()=>void
}

export const useProductDetailStore = create<ProductDetailStore>((set)=>({
    productDetails:[],
    updateProductDetals:(data)=>set((state)=>({
        productDetails:[...state?.productDetails,data]
    })),
    resetProductDetails:()=>set({productDetails: []})
}))