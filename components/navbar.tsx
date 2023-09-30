"use client";
import * as React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    ListItem,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/components/user-profile";

export function Navbar({ ...props }) {
    return (
        <nav className="flex h-16 items-center px-4">
            <NavigationMenu className={cn("mx-6")} {...props}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                <span className="font-bold">Home</span>
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <Separator
                        className="mx-4 my-2"
                        orientation="vertical"
                    ></Separator>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Classes</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="flex flex-row gap-x-4 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-4 flex-grow-0">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted dark:from-indigo-500 dark:to-violet-950 p-6 no-underline outline-none focus:shadow-md"
                                            href="/class"
                                        >
                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                Classes{" "}
                                                <span className="text-muted-foreground">
                                                    23
                                                </span>
                                            </div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                Manage your classes or create a
                                                new one here.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <ul className="">
                                    <ListItem href="/class/c60s1t92e9zz1ql">
                                        PLACEHOLDER CLASS 1
                                    </ListItem>
                                    <ListItem href="/class/c60s1t92e9zz1ql">
                                        PLACEHOLDER CLASS 2
                                    </ListItem>
                                    <ListItem href="/class/c60s1t92e9zz1ql">
                                        PLACEHOLDER CLASS 3
                                    </ListItem>
                                    <Separator className="my-2 px"></Separator>
                                    <ListItem className="col-span-1 font-bold">
                                        New Class
                                    </ListItem>
                                </ul>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Files</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="flex flex-row gap-x-4 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-4 flex-grow-0">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted dark:from-emerald-400 dark:to-teal-800 p-6 no-underline outline-none focus:shadow-md"
                                            href="/file"
                                        >
                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                Files{" "}
                                                <span className="text-muted-foreground">
                                                    4
                                                </span>
                                            </div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                See recent files or create and
                                                new content.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <ul className="">
                                    <ListItem href="/file/1">
                                        PLACEHOLDER FILE 1
                                    </ListItem>
                                    <ListItem href="/file/1">
                                        PLACEHOLDER FILE 2
                                    </ListItem>
                                    <ListItem href="/file/1">
                                        PLACEHOLDER FILE 3
                                    </ListItem>
                                    <Separator className="my-2 px"></Separator>
                                    <ListItem className="col-span-1 font-bold">
                                        Upload File
                                    </ListItem>
                                </ul>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div className="ml-auto flex items-center space-x-4">
                <ModeToggle></ModeToggle>
                <UserProfile></UserProfile>
            </div>
        </nav>
    );
}
