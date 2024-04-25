"use client"

import { CartItem } from "@/types/cartitem";
import useSWR from "swr";

import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { useProductsContext } from "@/context/products";

import Image from "next/image";
import { OrderPreview } from "./OrderPreview";
import { ProductImage } from "@/libs/products";

const OrderDetails = ({ cartItem }: { cartItem: CartItem }) => {
    const { products } = useProductsContext();

    const getProductDetails = (cartItem: CartItem) => {
        const product = products.find((product) => product._id == cartItem.id);
        if (product == undefined) return null;

        if (product._hasVariants != (cartItem.variant != null)) return null;

        if (product._hasVariants) {
            const variant = product.variants.find((variant) => variant._specId == cartItem.variant);
            if (variant == undefined) return null;

            return {
                name: product.name,
                variantName: variant.name,
                price: variant.price,
                image: variant.image
            };
        }

        return {
            name: product.name,
            price: product.price,
            image: product.image
        };
    }

    const product = getProductDetails(cartItem);

    if (product == null) return (
        <tr className="*:px-5 *:py-2 *:border">
            <td colSpan={5}>
                <h1 className="w-full text-center text-md font-semibold">{`Cannot retrieve '${cartItem.id}'.`}</h1>
            </td>
        </tr>
    );

    return (
        <tr key={product?.name + (product?.variantName ? ` - ${product?.variantName}` : '')} className="*:px-5 *:py-2 *:border">
            <td>
                <div className="w-8 h-8 relative">
                    <Image fill className="h-full w-full object-contain object-center" src={ProductImage(product?.image!)} alt={product?.image!} />
                </div>
            </td>

            <td className="text-left">
                <h1 className="text-md font-semibold truncate w-56">{product?.name + (product?.variantName ? ` - ${product?.variantName}` : '')}</h1>
            </td>

            <td className="text-right">
                <h1 className="text-md font-medium">x{cartItem.quantity}</h1>
            </td>

            <td className="text-right">
                <h1>₹{product.price}</h1>
            </td>

            <td className="text-right">
                <h1 className="font-semibold">₹{product.price * cartItem.quantity}</h1>
            </td>
        </tr>
    )
}

export const ProductOrderPreview = ({ order }: { order: string }) => {
    const { data, isLoading } = useSWR(`/api/order/products?id=${order}`, (s: string) => fetch(s).then(res => res.json()));
    const { products } = useProductsContext();

    if (isLoading) return null;

    const getProductPrice = (cartItem: CartItem) => {
        const product = products.find((product) => product._id == cartItem.id);
        if (product == undefined) return 0;

        if (product._hasVariants != (cartItem.variant != null)) return 0;

        if (product._hasVariants) {
            const variant = product.variants.find((variant) => variant._specId == cartItem.variant);
            if (variant == undefined) return 0;
            return variant.price;
        }

        return product.price;
    }

    return (
        <OrderPreview date={data?.date!} orderId={order} title="Products Order">
            <div className="max-h-96 rounded-lg overflow-auto">
                <table className="w-full">
                    <thead>
                        <tr className="*:px-5 *:py-2 *:border">
                            <th className="text-center">
                                <FontAwesomeIcon icon={faImage} />
                            </th>
                            <th className="text-left"><h1>Name</h1></th>
                            <th className="text-right"><h1>Qty.</h1></th>
                            <th className="text-right"><h1>MRP</h1></th>
                            <th className="text-right"><h1>Total</h1></th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.items.map((item: CartItem) => <OrderDetails key={`itemId: ${item.id} itemVariant: ${item.variant}`} cartItem={item} />)}
                    </tbody>

                    <tfoot>
                        <tr className="*:px-5 *:py-2 *:border">
                            <th />
                            <th className="text-left"><h1>Total</h1></th>
                            <th />
                            <th />
                            <th>
                                <h1 className="font-bold">₹{data.items.reduce((total: number, item: CartItem) => (total + (getProductPrice(item) * item.quantity)), 0)}</h1>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </OrderPreview>
    )
}