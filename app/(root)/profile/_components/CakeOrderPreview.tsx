import useSWR from "swr";
import { formatDate } from "../_lib/getproduct";
import { cakes, imagePath } from "@/app/_lib/cakes";
import { CakeOrder } from "@/app/api/order/cake/_lib/cakeorders";
import { motion } from "framer-motion";
import Image from "next/image";
import { OrderPreview } from "./OrderPreview";

type OrderType = CakeOrder & { date: number };

const OrderDetails = ({ cakeOrder }: { cakeOrder: OrderType }) => {
    const cake = cakes.find((c) => c._id == cakeOrder.type);
    if (!cake) return null;

    return (
        <>
            <div className="flex border rounded-lg items-center rounded-lg overflow-clip bg-pink-50 text-red-400">
                <div className="w-24 h-24 relative">
                    <Image fill className="w-full h-full object-cover" src={imagePath(cake.path)} alt="" />
                </div>
                <div className="px-5 py-2">
                    <h1 className="font-semibold">{cake.title}</h1>
                    <h2 className="">₹{cake.price}/kg</h2>
                </div>
            </div>

            <br />

            <h1 className="text-lg truncate">Message: <span className="font-semibold">{cakeOrder.message || "No message given."}</span></h1>
            <h1 className="text-lg">Quantity: {cakeOrder.quantity} Kg</h1>
            <h1 className="text-lg">Candles Included: {cakeOrder.need_candles ? "Yes" : "No"}</h1>

            <br />

            <h1>Other Request:</h1>
            <p className="max-h-48 border rounded-lg p-2 bg-gray-50 text-gray-400">{cakeOrder.other_request || "N/A"}</p>

            <br />

            <div className="flex text-xl font-semibold">
                <h1 className="font-serif">Total</h1>
                <h1 className="ml-auto">₹{cake.price * cakeOrder.quantity}</h1>
            </div>
        </>
    )
}

export const CakeOrderPreview = ({ order }: { order: string }) => {
    const { data, isLoading } = useSWR<OrderType>(`/api/order/cake?id=${order}`, (s: string) => fetch(s).then(res => res.json()));

    if (isLoading) return null;

    return (
        <OrderPreview title="Cake Order" date={data?.date!} orderId={order}>
            <OrderDetails cakeOrder={data!} />
        </OrderPreview>
    )
}