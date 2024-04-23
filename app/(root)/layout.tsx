import Navbar from './_components/Navbar'
import Cart from './_components/Cart/Cart';
import LoginWrapper from "./loginwrapper"
import { UserProvider } from '@/context/user';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <UserProvider>
            <main id="root-main" className='min-h-screen flex flex-col'>
                <LoginWrapper>
                    <Navbar />
                    {children}
                </LoginWrapper>
            </main>
            <Cart />
        </UserProvider>
    )
}