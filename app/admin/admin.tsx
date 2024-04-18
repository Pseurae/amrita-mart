"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useProducts } from "../_context/products"
import { Product as ProductType, imagePath } from "../_types/product";

export default function () {
    const { products, loading, error } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    const isBufferDirty = useRef(false);

    const Sidebar = () => {
        const Selector = () => {
            if (loading) return (<h1 className="p-4">Loading...</h1>);
            if (error) return (<h1 className="p-4">Error</h1>);

            const selectorScroller = useRef<HTMLUListElement>(null!);

            useLayoutEffect(() => {
                selectorScroller.current.scrollTop = sessionStorage.getItem("adminProductSelectorScroll") ? Number.parseInt(sessionStorage.getItem("adminProductSelectorScroll")!) : 0;
            }, []);

            const onScroll = (e: React.UIEvent<HTMLUListElement>) => {
                if (!(loading || error)) sessionStorage.setItem("adminProductSelectorScroll", JSON.stringify(e.currentTarget.scrollTop));
            }

            const changeSelectedProject = (product: ProductType) => {
                setSelectedProduct(product);
                isBufferDirty.current = false;
            }

            const previewImage = (product: ProductType) => (product._hasVariants ? product.variants[product.defaultVariant].image : product.image);

            return (
                <ul ref={selectorScroller} className="overflow-auto grow h-full hide-scrollbar" onScroll={onScroll}>
                    {products.map((product) => (
                        <li key={product._id}>
                            <button className={"px-4 py-3 hover:bg-gray-200 rounded-lg w-full text-left flex gap-4 items-center " + ((selectedProduct?._id == product._id) && "text-red-400 bg-red-100")} onClick={() => changeSelectedProject(product)}>
                                <img className="h-16 w-16 object-contain" src={imagePath(previewImage(product))} alt={previewImage(product)} />
                                <div>
                                    <h1 className="text-md font-medium">{product.name}</h1>
                                    <h2 className="opacity-80">{product._id}</h2>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )
        }
        return (
            <div className="bg-gray-50 p-4 border-r flex flex-col min-h-full">
                <h1 className="p-4 font-bold text-xl">Products</h1>
                <Selector />
            </div>
        )
    };

    const MainPage = () => {
        if (selectedProduct == null) return null;

        const [productClone, setProductClone] = useState(selectedProduct);

        const changeDetails = (deets: object) => {
            setProductClone({ ...productClone, ...deets });
            isBufferDirty.current = true;
        }

        const Details = () => {
            return (
                <>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Name</label>
                            <input className="outline-none border p-2 rounded" type="text" name="" id="" value={productClone.name} onChange={(e) => changeDetails({ name: e.target.value })} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Preview Image</label>

                            <div className="h-48 w-48 border rounded overflow-hidden">
                                <img src={imagePath(productClone.image)} alt={productClone.image} className="h-full w-full object-contain" />
                            </div>

                            <input className="outline-none border p-2 rounded" type="text" name="" id="" value={productClone.image} onChange={(e) => changeDetails({ previewImage: e.target.value })} />

                            <p>Given path must be relative to public/images/products folder.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Type</label>
                            <select className="outline-none border p-2 rounded" name="" id="" defaultValue={productClone.type} onChange={(e) => changeDetails({ type: e.target.value })}>
                                <option value="article">Article</option>
                                <option value="food">Food</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium">Has Variants</label>
                            
                            <label>
                                <input type="radio" name="" id="" onChange={() => changeDetails({ _hasVariants: true })} checked={productClone._hasVariants} /> Yes
                            </label>

                            <label>
                                <input type="radio" name="" id="" onChange={() => changeDetails({ _hasVariants: false })} checked={!productClone._hasVariants} /> No
                            </label>
                        </div>

                        { productClone._hasVariants ? 
                            (null) :
                            (<>
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium">Price</label>
                                    <input className="outline-none border p-2 rounded" type="text" name="" id="" value={productClone.price} onChange={(e) => changeDetails({ price: e.target.valueAsNumber })} />
                                </div>
                            </>) 
                        }
                    </div>
                </>
            );
        }

        return (
            <div className="flex flex-col min-h-full">
                <div className="grow flex flex-col overflow-auto">
                    <div className="px-72 py-10 sticky top-0 left-0 bg-white">
                        <h1 className="text-4xl font-bold mb-2">{selectedProduct.name}</h1>
                        <h2 className="text-2xl font-medium opacity-80">{selectedProduct._id}</h2>
                    </div>

                    <div className="px-72 pb-8 grow">
                        <Details />
                    </div>

                    <div className="sticky bottom-0 left-0 bg-white">
                        <div className="h-px w-full bg-gray-300" />
                        <div className="mx-72 my-6">
                            <button className="px-4 py-2 bg-blue-400 font-semibold rounded-md text-white disabled:bg-gray-400" disabled={!isBufferDirty.current}>Publish</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[1fr_4fr] h-screen">
            <Sidebar />
            <MainPage />
        </div>
    )
}