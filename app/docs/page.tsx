"use client"
import { title } from "@/components/primitives";
import {Image} from "@nextui-org/react";

export default function DocsPage() {
  return (
    <div>
      <h1 className={title()}>Docs</h1>
      <Image
      isBlurred
      alt="NextUI Album Cover"
      className="m-5"
      src="https://nextui.org/images/album-cover.png"
      width={240}
    />

    </div>
  );
}
