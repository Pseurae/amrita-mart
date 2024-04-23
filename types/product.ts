type CommonDetails = {
    image: string;
    price: number;
    stock: number;
};

type MultiExtraDetails = { 
    name: string,
    _specId: string
};

type Variant<Categories> = CommonDetails & MultiExtraDetails & {
    category: Categories;
}

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
    variants: Variant<Categories>[];
};

type Product = {
    name: string;
    _id: string;
} & (
    Details<'food', FoodCategories> |
    Details<'article', ArticleCategories>
);

export type { FoodCategories, ArticleCategories, Product };
