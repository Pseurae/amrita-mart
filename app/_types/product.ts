type CommonDetails = {
    image: string;
    price: number;
    stock: number;
};

type MultiExtraDetails = { 
    name: string,
    _specId: string
};

type FoodCategories = 'veg' | 'non-veg' | 'beverage' | 'snack';
type ArticleCategories = 'stationary' | 'hygiene';

type Details<Type, Categories> = ({
    _hasVariants: false;
    type: Type,
    category: Categories,
} & CommonDetails) | {
    _hasVariants: true;
    type: Type,
    defaultVariant: number;
    variants: (CommonDetails & MultiExtraDetails & { category: Categories })[];
};

type Product = {
    name: string;
    _id: string;
} & (
    Details<'food', FoodCategories> |
    Details<'article', ArticleCategories>
);

export const imagePath = (i: string) => `/images/products/${i}`;

export type { FoodCategories, ArticleCategories, Product };
