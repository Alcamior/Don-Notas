// components/editor/DynamicEditor.tsx
"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const Editor = dynamic(
  () => import("./editor").then(mod => mod.BlockNoteEditor),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full rounded-md" />
  }
);