import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface BlockNavigationProps {
  currentSlot: number;
  minSlot: number;
  maxSlot: number;
  timestamp: string;
}

export default function BlockNavigation({
  currentSlot,
  minSlot,
  maxSlot,
  timestamp
}: BlockNavigationProps) {
  const prevSlot = currentSlot - 1;
  const nextSlot = currentSlot + 1;

  return (
    <div className="flex flex-col items-end justify-start gap-2">
      <div className="flex flex-row items-center gap-2">
        <Link href={`/block/${prevSlot}`}>
          <Button
            variant="outline"
            size="default"
            disabled={prevSlot < minSlot}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <Link href={`/block/${nextSlot}`}>
          <Button
            variant="outline"
            size="default"
            disabled={nextSlot > maxSlot}
          >
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      <div className="text-sm text-gray-500">
        {timestamp}
      </div>
    </div>
  );
}