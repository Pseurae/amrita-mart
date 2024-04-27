import { CakeOrder, ProductOrder } from "@/types/orders";
import { OrderPlacer } from "./orderplacer";

export const Products = new OrderPlacer<ProductOrder>("products");
export const Cakes = new OrderPlacer<CakeOrder>("cakes");
