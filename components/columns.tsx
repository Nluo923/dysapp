"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CalendarIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import TimeAgo from "react-timeago";
import Link from "next/link";

export type FileRow = {
  id: string;
  title: string;
  created: string;
  class_id?: string;
  class_name?: string;
};

export const columns: ColumnDef<FileRow>[] = [
  {
    accessorKey: "id",
    header: "File ID",
    cell: ({ row }) => {
      return (
        <Link
          className="underline decoration-inherit hover:text-teal-400 transition-colors"
          href={`file/${row.original.id}`}
        >
          {row.original.id}
        </Link>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "class_name",
    header: "Class",
    cell: ({ row }) => {
      if (row.original.class_id) {
        return (
          <div className="flex flex-row align-middle items-center space-x-1">
            <Link
              href={`class/${row.original.class_id}`}
              className="underline decoration-inherit hover:text-teal-400 transition-colors"
            >
              {row.original.class_name}
            </Link>
            {/* <HoverCard>
              <HoverCardTrigger asChild>
                <InfoCircledIcon></InfoCircledIcon>
              </HoverCardTrigger>
              <HoverCardContent className="">
                {row.original.class_id}
              </HoverCardContent>
            </HoverCard> */}
          </div>
        );
      }

      return <p className="text-muted-foreground">n/a</p>;
    },
  },
  {
    accessorKey: "created",
    header: () => {
      return (
        <div className="text-right flex flex-row-reverse align-middle items-center mr-1">
          <p className="ml-1">{"Created"}</p>
          <CalendarIcon></CalendarIcon>
        </div>
      );
    },
    cell: ({ row }) => {
      const formatted = new Date(row.getValue("created"));
      return (
        <div className="text-right font-medium mr-1">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div>
                <TimeAgo date={formatted} title=""></TimeAgo>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              {formatted.toDateString()}
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
];
