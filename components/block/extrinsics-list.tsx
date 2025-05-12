import { Extrinsic } from '@/lib/types/extrinsic';
import { formatHash } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ExtrinsicsListProps {
  extrinsics: Extrinsic;
}

export default function ExtrinsicsList({ extrinsics }: ExtrinsicsListProps) {
  return (
    <div className='space-y-6'>
      {/* Tickets Table */}
      {extrinsics.tickets.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attempt</TableHead>
                <TableHead>Signature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extrinsics.tickets.map((ticket, index) => (
                <TableRow key={index}>
                  <TableCell>{ticket.attempt}</TableCell>
                  <TableCell className='font-mono text-sm'>
                    {formatHash(ticket.signature)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Preimage Table */}
      {extrinsics.preimages.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Blob</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extrinsics.preimages.map((preimage, index) => (
                <TableRow key={index}>
                  <TableCell>{preimage.requester}</TableCell>
                  <TableCell className='font-mono text-sm'>
                    {formatHash(preimage.blob)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Guarantee Table */}
      {extrinsics.guarantees.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slot</TableHead>
                <TableHead>Work Package</TableHead>
                <TableHead>Signatures</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extrinsics.guarantees.map((guarantee, index) => (
                <TableRow key={index}>
                  <TableCell>{guarantee.slot}</TableCell>
                  <TableCell className='font-mono text-sm'>
                    {/* TODO: Add work package hash */}
                    {/* {formatHash(guarantee.report.spec.hash)} */}
                  </TableCell>
                  <TableCell>
                    <div className='space-y-1'>
                      {guarantee.signatures.map((sig, sigIndex) => (
                        <div key={sigIndex} className='text-xs'>
                          {/* TODO: Add validator index */}
                          {/* Validator {sig.validator_index}:{' '}
                          {formatHash(sig.signature)} */}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Assurance Table */}
      {extrinsics.assurances.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Validator</TableHead>
                <TableHead>Anchor</TableHead>
                <TableHead>Bitfield</TableHead>
                <TableHead>Signature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extrinsics.assurances.map((assurance, index) => (
                <TableRow key={index}>
                  <TableCell>{assurance.validator_index}</TableCell>
                  <TableCell className='font-mono text-sm'>
                    {formatHash(assurance.anchor)}
                  </TableCell>
                  <TableCell className='font-mono'>
                    {/* TODO: Add bitfield */}
                    {assurance.bitfield}
                  </TableCell>
                  <TableCell className='font-mono text-sm'>
                    {formatHash(assurance.signature)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
