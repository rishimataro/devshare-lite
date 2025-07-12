import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntdConfig from '@/components/AntdConfig';
import ErrorBoundary from '@/components/ErrorBoundary';
import ClientSessionWrapper from '@/components/ClientSessionWrapper';
import '@/app/globals.css';

export const metadata: Metadata = {
    title: "DevShare Lite",
    description: "Share and discover developer content",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <ClientSessionWrapper>
                    <AntdRegistry>
                        <AntdConfig>
                            <ErrorBoundary>
                                {children}
                            </ErrorBoundary>
                        </AntdConfig>
                    </AntdRegistry>
                </ClientSessionWrapper>
            </body>
        </html>
    );
}
