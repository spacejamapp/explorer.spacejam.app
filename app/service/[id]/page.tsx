import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMockServices } from "@/lib/mock/service";
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

interface ServicePageProps {
  params: {
    id: string;
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const serviceId = parseInt(params.id, 10);

  // Get the service data from our mock services
  const allServices = getMockServices(40);
  const serviceItem = allServices.find((item) => item.service === serviceId);

  // If service not found, show 404
  if (!serviceItem) {
    notFound();
  }

  const { data } = serviceItem;
  const { service, preimages } = data;

  // Format bytes to readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <main className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold mb-2">Service #{serviceId}</h1>
          <p className="text-xs break-all p-3 rounded-md">0x{service.code}</p>
        </div>

        <p className="text-muted-foreground mb-2">
          Detailed information about this service account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {service.balance.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gas Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {service.gas.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatBytes(service.total)}</p>
              <p className="text-xs text-muted-foreground">
                {service.items} items
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="preimages">
          <TabsList>
            <TabsTrigger value="preimages">
              Preimages ({preimages.length})
            </TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="preimages">
            <Card>
              <CardHeader>
                <CardTitle>Preimages</CardTitle>
                <CardDescription>
                  List of preimage hashes associated with this service
                </CardDescription>
              </CardHeader>
              <CardContent>
                {preimages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Preimage Hash</TableHead>
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
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Storage Used
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold">
                        {formatBytes(service.total)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Items in Storage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold">{service.items}</p>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Average Item Size
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold">
                        {service.items > 0
                          ? formatBytes(service.total / service.items)
                          : "0 Bytes"}
                      </p>
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
