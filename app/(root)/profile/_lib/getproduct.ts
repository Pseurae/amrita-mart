import useSWR from "swr";

import { User } from "@/types/user";
import { CartItem } from "@/types/cartitem";
import { Product as ProductType } from "@/types/product";

export interface ProductProps {
    name: string;
    image: string;
    price: number,
    variantName?: string;
};

export const formatDate = (date: number) => new Date(date).toLocaleDateString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', month: 'long', day: 'numeric' });
