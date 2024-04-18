export type Cake = {
    _id: string;
    title: string;
    path: string;
    price: number
};

export const cakes: Cake[] = [
    { _id: 'red-velvet', title: 'Red Velvet', path: 'red-velvet.jpg', price: 800 },
    { _id: 'choco-truffle', title: 'Chocolate Truffle', path: 'chocolate-truffle.jpg', price: 900 },
    { _id: 'vancho', title: 'Vancho', path: 'vancho.jpg', price: 700 },
    { _id: 'pineapple', title: 'Pineapple Cake', path: 'pineapple-cake.jpg', price: 1000 },
];