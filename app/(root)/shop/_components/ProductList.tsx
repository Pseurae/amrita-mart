import { Product as ProductType } from '@/types/product'
import Listing from './Listing'
import { Placeholder, Product } from './Product'

interface ProductListProps {
    products: ProductType[],
    searchPrompt: string,
    setModalProduct: (product: ProductType) => void
};

export const ProductList = ({ products, searchPrompt, setModalProduct }: ProductListProps) => {
    const trimmedPrompt = searchPrompt.trim();
    const filteredProducts = products.filter((product) => {
        if (trimmedPrompt.length == 0) return true;

        if (product.name.toLowerCase().includes(trimmedPrompt.toLowerCase()))
            return true;

        if (product._hasVariants) {
            for (const variant of product.variants) {
                if (variant.name.toLowerCase().includes(trimmedPrompt.toLowerCase()))
                    return true;
            }
        }
        return false;
    });

    return (
        filteredProducts.length == 0 ? (
            <h1 className='font-semibold'>No products found for "{searchPrompt}".</h1>
        ) : (
            <Listing products={filteredProducts} callback={(product: ProductType) => (<Product product={product} key={product._id} onClick={() => setModalProduct(product)} />)} />
        )
    )
}

export const PlaceholderList = () => {
    return (
        <Listing products={Array(12).fill(undefined)} callback={(_, i) => (<Placeholder key={i} />)} />
    )
};