import ValidatorsMap from "@/components/network/validators-map";
import { mockValidators } from "@/lib/mock/validator";

export default function NetworkPage() {
  return (
    <main className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">JAM Network</h1>

      <ValidatorsMap validators={mockValidators} />
    </main>
  );
}
