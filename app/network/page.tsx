import ValidatorsMap from "@/components/network/validators-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NetworkCard from "@/components/card/network";
import { Validator } from "@/lib/types/network";
import { mockValidators } from "@/lib/mock/validator";

// Mock data for demonstration
const mockNetwork = {
  extrinsics: 1234567,
  finalized: 987654,
  services: 42,
};

export default function NetworkPage() {
  return (
    <main className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Network Statistics</h1>

      <ValidatorsMap validators={mockValidators} />
    </main>
  );
}
