import Link from 'next/link';

interface BlockFieldProps {
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
  linkClassName?: string;
}

export default function BlockField({ 
  label, 
  value, 
  isLink = false, 
  href, 
  linkClassName = "text-pink-300 hover:underline" 
}: BlockFieldProps) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-500">
        {label}
      </div>
      <div className="font-mono break-all text-sm">
        {isLink && href ? (
          <Link href={href} className={linkClassName}>
            {value}
          </Link>
        ) : (
          value
        )}
      </div>
    </div>
  );
}