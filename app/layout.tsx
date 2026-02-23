'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { App } from '@capacitor/app';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const router = useRouter();
    useEffect(() => {
        const backListener = App.addListener('backButton', ({ canGoBack }) => {
            if (canGoBack) {
                router.back();
            } else {
                App.exitApp();
            }
        });
        return () => {
            backListener.remove();
        };
    }, [router]);
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
