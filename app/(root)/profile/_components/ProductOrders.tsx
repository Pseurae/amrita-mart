"use client"

import useSWR from "swr";
import { Modal } from "@/components/Modal";
import { ButtonHTMLAttributes, useState } from "react";
import { ProductOrderPreview } from "./ProductOrderPreview";
import PlaceholderBar from "@/components/PlaceholderBar";

const ProductOrder = ({ order, ...props }: { order: string } & ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { data, isLoading } = useSWR(`/api/order/products?id=${order}`, (s: string) => fetch(s).then(res => res.json()));
    const { "disabled": _, ...newProps } = props;

    if (isLoading) return (
        <button {...newProps} disabled={true}>
            <PlaceholderBar />
            <PlaceholderBar />
        </button>
    );

    const date = new Date(data?.date!).toLocaleDateString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <button {...props}>
            <h1 className="text-left truncate">ID: <span className="font-semibold">{order}</span></h1>
            <h1 className="text-left truncate">{date}</h1>
        </button>
    )
}

const ProductOrders = ({ orders }: { orders: string[] }) => {
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    return (
        <>
            <div className="grid grid-cols-4 gap-5">
                {orders.toReversed().map((order) => (
                    <ProductOrder className="p-4 border rounded-xl transition enabled:hover:text-red-400 enabled:hover:border-red-400 enabled:hover:bg-pink-50 enabled:hover:shadow-lg enabled:hover:shadow-pink-100/75" key={order} order={order} onClick={() => setSelectedOrder(order)} />
                ))}
            </div>

            <Modal isModalOpen={selectedOrder != null} closeModal={() => setSelectedOrder(null)} parentStyles="grid place-content-center" overlayStyles="bg-black/[0.6] backdrop-blur-sm">
                <ProductOrderPreview order={selectedOrder!} />
            </Modal>
        </>
    )
}

export default ProductOrders;