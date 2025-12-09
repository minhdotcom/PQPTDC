// /src/features/dashboard/RecordRowClient.tsx

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import AccuracyCell from './AccuracyCell';
import ApproveButton from './ApproveButton';

type Props = {
  id: number;
  created_at: Date | null;
  plate_wim: string | null;
  plate_camera: string | null;
  thumbnail_url: string | null;
  is_accurate: boolean | null;
  status: string | null;
  canEdit: boolean;
  canApprove: boolean; // ← THÊM
};

export default function RecordRowClient({
  id,
  created_at,
  plate_wim,
  plate_camera,
  thumbnail_url,
  is_accurate,
  status,
  canEdit,
  canApprove, // ← THÊM
}: Props) {
  const router = useRouter();

  // console.log('RecordRowClient:', { id, status, canApprove }); // ← THÊM

  const handleClick = () => {
    router.push(`/dashboard/${id}`);
  };

  return (
    <tr
      onClick={handleClick}
      className="group cursor-pointer transition hover:bg-blue-50"
    >
      <td className="px-6 py-4 font-mono text-sm text-gray-400">
        #
        {id}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {created_at ? new Date(created_at).toLocaleString('vi-VN') : '-'}
      </td>
      <td className="px-6 py-4 text-sm font-bold text-blue-700">
        {plate_wim || '---'}
      </td>
      <td className="px-6 py-4 text-sm font-bold text-green-700">
        {plate_camera || '---'}
      </td>
      <td className="px-6 py-4">
        {thumbnail_url
          ? (
              <Image
                src={thumbnail_url}
                alt="thumb"
                width={80}
                height={50}
                className="rounded border object-cover transition-transform group-hover:scale-105"
              />
            )
          : (
              <span className="text-xs text-gray-400">No image</span>
            )}
      </td>
      <td className="px-6 py-4 text-center">
        <AccuracyCell
          recordId={id}
          isAccurate={is_accurate}
          canEdit={canEdit}
        />
      </td>
      <td className="px-6 py-4">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${
            status === 'approved'
              ? 'border-green-200 bg-green-100 text-green-800'
              : status === 'inspected'
                ? 'border-blue-200 bg-blue-100 text-blue-800'
                : status === 'rejected'
                  ? 'border-red-200 bg-red-100 text-red-800'
                  : 'border-yellow-200 bg-yellow-50 text-yellow-800'
          }`}
        >
          {(status || 'PENDING').toUpperCase()}
        </span>
      </td>
      {/* ← THÊM CỘT MỚI */}
      <td className="px-6 py-4 text-center">
        <ApproveButton
          recordId={id}
          currentStatus={status}
          canApprove={canApprove}
        />
      </td>
    </tr>
  );
}
