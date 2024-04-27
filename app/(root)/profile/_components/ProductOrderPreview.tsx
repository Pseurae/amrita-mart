"use client"

import { CartItem } from "@/types/cartitem";
import useSWR from "swr";

import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faSpinner } from '@fortawesome/free-solid-svg-icons'

import Image from "next/image";
import { OrderPreview } from "./OrderPreview";
import { ProductImage } from "@/libs/products";
import useCartItemInfo from "@/libs/use-cartiteminfo";
import { CartItemInfo } from "@/types/cartiteminfo";

const OrderDetails = ({ info }: { info: NonNullable<CartItemInfo> }) => {
    // if (info == undefined) return (
    //     <tr className="*:px-5 *:py-2 *:border">
    //         <td colSpan={5}>
    //             <h1 className="w-full text-center text-md font-semibold">{`Cannot retrieve item from order.`}</h1>
    //         </td>
    //     </tr>
    // );

    return (
        <tr key={info?.name + (info?.variantName ? ` - ${info?.variantName}` : '')} className="*:px-5 *:py-2 *:border">
            <td>
                <div className="w-8 h-8 relative">
                    <Image fill className="h-full w-full object-contain object-center" src={ProductImage(info?.image!)} alt={info?.image!} />
                </div>
            </td>

            <td className="text-left">
                <h1 className="text-md font-semibold truncate w-56">{info?.name + (info?.variantName ? ` - ${info?.variantName}` : '')}</h1>
            </td>

            <td className="text-right">
                <h1 className="text-md font-medium">x{info.quantity}</h1>
            </td>

            <td className="text-right">
                <h1>₹{info.price}</h1>
            </td>

            <td className="text-right">
                <h1 className="font-semibold">₹{info.price * info.quantity}</h1>
            </td>
        </tr>
    )
}

export const ProductOrderPreview = ({ order }: { order: string }) => {
    const { data, isLoading } = useSWR(`/api/order/products?id=${order}`, (s: string) => fetch(s).then(res => res.json()));
    const [products, loadedProducts] = useCartItemInfo(isLoading ? [] : data.items);

    const loadedAllData = !isLoading && loadedProducts;

    const getCartItemInfo = (id: string, variant: string | null) => {
        return products.find((i) => i != undefined && i.id == id && i.variant == variant);
    }

    return (
        <OrderPreview date={loadedAllData ? data?.date! : undefined} orderId={order} title="Products Order">
            <div className="max-h-96 rounded-lg overflow-auto">
                {loadedAllData ? (
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
                            {data.items.map((item: CartItem) => {
                                const info = getCartItemInfo(item.id, item.variant);
                                if (info == undefined) return null;
                                return <OrderDetails key={`itemId: ${item.id} itemVariant: ${item.variant}`} info={info} />;
                            })}
                        </tbody>

                        <tfoot>
                            <tr className="*:px-5 *:py-2 *:border">
                                <th />
                                <th className="text-left"><h1>Total</h1></th>
                                <th />
                                <th />
                                <th>
                                    <h1 className="font-bold">₹{products.reduce((total: number, val: CartItemInfo) => {
                                        if (val == undefined) return total;
                                        return total + val.price;
                                    }, 0)}</h1>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <div>
                        <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
                    </div>
                )}
            </div>

        </OrderPreview>
    )
}