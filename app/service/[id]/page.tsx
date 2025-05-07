import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMockServices } from "@/lib/mock/service";
import { formatBytes } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CoinsIcon,
  FlameIcon,
  DatabaseIcon,
  LayersIcon,
  ClockIcon,
} from "lucide-react";

interface ServicePageProps {
  id: string;
}

export default async function ServicePage({
  params,
}: {
  params: Promise<ServicePageProps>;
}) {
  const serviceId = parseInt((await params).id, 10);

  // Get the service data from our mock services
  const allServices = getMockServices(40);
  const serviceItem = allServices.find((item) => item.service === serviceId);

  // If service not found, show 404
  if (!serviceItem) {
    notFound();
  }

  const { data } = serviceItem;
  const { service, preimages } = data;

  return (
    <main className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold mb-2">Service #{serviceId}</h1>
          <p className="break-all p-3 rounded-md">0x{service.code}</p>
        </div>

        <p className="text-muted-foreground mb-2">
          Detailed information about this service account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-row items-center gap-4">
              <div className="bg-amber-100 dark:bg-amber-950 p-3 rounded-lg">
                <CoinsIcon className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Balance</div>
                <div className="text-2xl font-bold">
                  {service.balance.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-row items-center gap-4">
              <div className="bg-red-100 dark:bg-red-950 p-3 rounded-lg">
                <FlameIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Gas Limit</div>
                <div className="text-2xl font-bold">
                  {service.gas.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-row items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-lg">
                <DatabaseIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Storage</div>
                <div className="text-2xl font-bold">
                  {formatBytes(service.total)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="preimages">
          <TabsList>
            <TabsTrigger value="preimages">
              Preimages ({preimages.length})
            </TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="preimages">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Preimages</CardTitle>
                    <CardDescription>
                      List of preimage hashes associated with this service
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {preimages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            Preimage Hash
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preimages.map((hash, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-mono text-xs break-all">
                            {hash}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No preimages found for this service.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Recent work reports for this service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No reports found for this service.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage">
            <Card>
              <CardHeader>
                <CardTitle>Storage</CardTitle>
                <CardDescription>
                  Storage details for this service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border shadow-sm">
                    <CardContent className="p-4 flex flex-row items-center gap-4">
                      <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-lg">
                        <DatabaseIcon className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Total Storage
                        </div>
                        <div className="text-xl font-bold">
                          {formatBytes(service.total)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardContent className="p-4 flex flex-row items-center gap-4">
                      <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-lg">
                        <LayersIcon className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Items
                        </div>
                        <div className="text-xl font-bold">{service.items}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardContent className="p-4 flex flex-row items-center gap-4">
                      <div className="bg-green-100 dark:bg-green-950 p-3 rounded-lg">
                        <ClockIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Average Size
                        </div>
                        <div className="text-xl font-bold">
                          {service.items > 0
                            ? formatBytes(service.total / service.items)
                            : "0 Bytes"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
