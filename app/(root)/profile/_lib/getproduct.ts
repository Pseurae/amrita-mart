import useSWR from "swr";

import { User } from "../../../_types/user";
import { CartItem } from "../../../_types/cartitem";
import { Product as ProductType } from "../../../_types/product";

export interface ProductProps {
    name: string;
    image: string;
    price: number,
    variantName?: string;
};

export const formatDate = (date: number) => new Date(date).toLocaleDateString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', month: 'long', day: 'numeric' });
