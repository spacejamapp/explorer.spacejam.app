"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Block } from "@/lib/types/block";
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react";
import ExtrinsicsList from "./extrinsics-list";

interface BlockTabsProps {
  block: Block;
}

export default function BlockTabs({ block }: BlockTabsProps) {
  const [copied, setCopied] = useState(false);
  const [isRawDataExpanded, setIsRawDataExpanded] = useState(false);

  const copyToClipboard = () => {
    const blockData = JSON.stringify(block, null, 2);
    navigator.clipboard.writeText(blockData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="preimage">Preimages</TabsTrigger>
          <TabsTrigger value="guarantee">Guarantees</TabsTrigger>
          <TabsTrigger value="assurance">Assurances</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
              <CardDescription>
                {block.extrinsic.tickets.length} tickets in this block
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExtrinsicsList
                extrinsics={{
                  ...block.extrinsic,
                  preimage: [],
                  guarantee: [],
                  assurance: [],
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preimage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preimages</CardTitle>
              <CardDescription>
                {block.extrinsic.preimage.length} preimages in this block
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExtrinsicsList
                extrinsics={{
                  ...block.extrinsic,
                  tickets: [],
                  guarantee: [],
                  assurance: [],
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guarantee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guarantees</CardTitle>
              <CardDescription>
                {block.extrinsic.guarantee.length} guarantees in this block
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExtrinsicsList
                extrinsics={{
                  ...block.extrinsic,
                  tickets: [],
                  preimage: [],
                  assurance: [],
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assurances</CardTitle>
              <CardDescription>
                {block.extrinsic.assurance.length} assurances in this block
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExtrinsicsList
                extrinsics={{
                  ...block.extrinsic,
                  tickets: [],
                  preimage: [],
                  guarantee: [],
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Raw Data Section */}
      <Card>
        <CardHeader className="py-3 px-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-0 hover:bg-transparent"
            onClick={() => setIsRawDataExpanded(!isRawDataExpanded)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {isRawDataExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <CardTitle className="text-base">Raw Block Data</CardTitle>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard();
                }}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Data</span>
                  </>
                )}
              </Button>
            </div>
          </Button>
        </CardHeader>
        {isRawDataExpanded && (
          <CardContent className="pt-0 px-4 pb-4">
            <pre className="p-4 rounded-lg overflow-auto max-h-[500px] text-xs">
              {JSON.stringify(block, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
