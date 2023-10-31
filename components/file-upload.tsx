"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import PocketBase from "pocketbase";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "@/components/ui/separator";
import { formatBytes } from "@/lib/utils";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const pb = new PocketBase("http://127.0.0.1:8090");

export function FileUpload({ ...props }) {
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    accept: {
      "text/plain": [".txt", ".md"],
      //"application/pdf": [".pdf"],
      "text/html": [".html", ".htm"],
    },
  });

  const [title, setTitle] = useState("");
  const [classroom, setClassroom] = useState("");

  const cardFile = (file: any) => (
    <>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col">
            <Label htmlFor="title" className="flex justify-between">
              <p className="">Title</p>
              <div className="text-sm text-end max-w-[80%] truncate flex justify-end">
                <p className=" font-normal text-muted-foreground">
                  {file.name}{" "}
                </p>
                <p className="mx-2 font-bold text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>
            </Label>

            <Input
              className="font-bold"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of file"
            ></Input>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="class">Upload to Class</Label>
              <Select value={classroom} onValueChange={(e) => setClassroom(e)}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="c60s1t92e9zz1ql">classdefault</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // raw
            try {
              const formData = new FormData();

              formData.append("file", acceptedFiles[0]);
              formData.append("title", title);
              formData.append("class", classroom);
              await pb.collection("files").create(formData);
            } catch (err) {
              //@ts-ignore
              console.log(err.originalError);
            }
          }}
        >
          <Input
            className="w-full bg-gradient-to-tr from-emerald-400 to-teal-800"
            type="submit"
            value="Upload"
          ></Input>
        </form>
      </CardFooter>
    </>
  );

  const files = acceptedFiles.length === 1 ? cardFile(acceptedFiles[0]) : null;

  return (
    <>
      <div className="flex flex-row">
        <div
          className={`container w-2/3 border rounded-md p-16 bg-gradient-to-tl from-muted/10 to-muted/20
            ${
              isFocused
                ? "border-blue-900"
                : isDragAccept
                ? "border-green-900"
                : isDragReject
                ? "border-red-900"
                : "border-white-100"
            }`}
        >
          <div {...getRootProps()}>
            <Input id="fileDropInput" {...getInputProps()}></Input>
            <UploadIcon className="mx-auto stroke-muted-foreground h-12 w-12 my-4"></UploadIcon>

            <p
              className={`text-center select-none ${
                isDragActive ? "text-muted" : "text-muted-foreground"
              } font-bold text-3xl`}
            >
              Upload a file
            </p>
            <p
              className={`text-center select-none ${
                isDragActive ? "text-muted" : "text-muted-foreground"
              } font-bold text-xs`}
            >
              <em>Only .txt, .html, .md files accepted</em>
            </p>
          </div>
        </div>
        <Separator
          className="flex-none mx-2"
          orientation="vertical"
        ></Separator>
        <div className="w-1/3 flex-col">
          <Card className="h-full">{files}</Card>
        </div>
      </div>
    </>
  );
}
