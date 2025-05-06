"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Block } from "@/lib/types/block";

interface BlockTabsProps {
  block: Block;
}

export default function BlockTabs({ block }: BlockTabsProps) {
  return (
    <Tabs defaultValue="transactions">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="validators">Validators</TabsTrigger>
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
        <TabsTrigger value="raw">Raw Data</TabsTrigger>
      </TabsList>

      <TabsContent value="transactions" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Extrinsics</CardTitle>
            <CardDescription>
              {block.extrinsic.count} extrinsics in this block
            </CardDescription>
          </CardHeader>
          <CardContent>
            {block.extrinsic.count ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">
                  Transactions data is not available in the mock version
                </p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No transactions in this block</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="validators" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Validators</CardTitle>
            <CardDescription>Validators involved in this block</CardDescription>
          </CardHeader>
          <CardContent>
            {block.header.epoch_mark?.validators ? (
              <div className="grid gap-4">
                {block.header.epoch_mark.validators.map((validator, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Bandersnatch
                        </div>
                        <div className="font-mono break-all text-sm">
                          {validator.bandersnatch}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          ED25519
                        </div>
                        <div className="font-mono break-all text-sm">
                          {validator.ed25519}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No validator data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tickets" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tickets</CardTitle>
            <CardDescription>Tickets in this block</CardDescription>
          </CardHeader>
          <CardContent>
            {block.header.tickets_mark ? (
              <div className="grid gap-4">
                {block.header.tickets_mark.map((ticket, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          ID
                        </div>
                        <div className="font-mono break-all text-sm">
                          {ticket.id}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Attempt
                        </div>
                        <div className="text-sm">{ticket.attempt}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No ticket data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="raw" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Raw Block Data</CardTitle>
            <CardDescription>
              Complete block data in JSON format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 rounded-lg overflow-auto max-h-[500px] text-xs">
              {JSON.stringify(block, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
