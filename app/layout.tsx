'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { PWAProvider } from '../components/PWAProvider';
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
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Business Management Application" />
                <meta name="theme-color" content="#4f46e5" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Manager" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icon-192.png" />
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PWAProvider />
                <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
