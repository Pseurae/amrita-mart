import { ArticleCategories, FoodCategories, Product as ProductType } from '@/types/product'

export const getPreviewPrice = (product: ProductType) => {
    if (product._hasVariants) {
        const sortedVariants = product.variants.toSorted((t1, t2) => { return t1.price - t2.price; });

        const first = sortedVariants.at(0)!;
        const last = sortedVariants.at(-1)!;

        if (first.price == last.price)
            return '₹' + last.price;

        return '₹' + first.price + ' - ' + '₹' + last.price;
    }

    return '₹' + product.price;
};

export const getCategoryName = (category: FoodCategories | ArticleCategories) => {
    switch (category) {
        case 'veg':
        case 'non-veg':
            return "Food";
        case 'beverage':
            return "Beverage"
        case 'snack':
            return "Snacks"
        case 'stationary':
            return "Stationary"
        case 'hygiene':
            return "Hygiene";
    }
};