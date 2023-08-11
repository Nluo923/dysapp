/* eslint-disable @next/next/no-head-element */
import Link from "next/link";
import "./globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <head></head>
            <body>
                <nav className="bg-gray-900">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <Link className="flex items-center" href="/">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Home
                            </span>
                        </Link>
                        <div
                            className="hidden w-full md:block md:w-auto"
                            id="navbar-default"
                        >
                            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                <NavBarLink title="About" />
                            </ul>
                        </div>
                    </div>
                </nav>
                <main>{children}</main>
            </body>
        </html>
    );
}

function NavBarLink({ title }: { title: string }) {
    return (
        <li>
            <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
                {title}
            </a>
        </li>
    );
}
