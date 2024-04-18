import Navbar from './_components/Navbar'
import Cart from './_components/Cart';
import LoginWrapper from "./loginwrapper"
import { UserProvider } from '../_context/user';

export default function ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <UserProvider>
            <main className='min-h-screen flex flex-col'>
                <LoginWrapper>
                    <Navbar />
                    {children}
                </LoginWrapper>
            </main>
            <Cart />
        </UserProvider>
    )
}