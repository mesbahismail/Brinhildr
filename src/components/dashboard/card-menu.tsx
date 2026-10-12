"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadCsv } from "@/lib/dashboard-utils";

type CardMenuProps = {
  filename: string;
  headers: string[];
  rows: Array<Array<string | number>>;
};

export function CardMenu({ filename, headers, rows }: CardMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            className="size-[clamp(24px,3.1vw,36px)]"
            aria-label="Open card menu"
          />
        }
      >
        <MoreVertical className="size-[clamp(14px,1.4vw,16px)] text-white/45" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-36 bg-[#252525] text-white"
      >
        <DropdownMenuItem onClick={() => downloadCsv(filename, headers, rows)}>
          Download CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
