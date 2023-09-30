"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FileUpload } from "@/components/file-upload";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function FilePage() {
  return (
    <>
      <FileUpload></FileUpload>
      <Separator></Separator>
      <Link href="./file/d3soxe2k9h5kp91">go</Link>
    </>
  );
}
