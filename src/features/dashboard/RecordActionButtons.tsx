// /src/features/dashboard/RecordActionButtons.tsx

'use client';

import { useTransition } from 'react';

import { approveRecord, updateAccuracy } from '@/actions/RecordActions';

type Props = {
  recordId: number;
  showEdit: boolean;
};

export default function RecordActionButtons({ recordId, showEdit }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleAccuracy = (isAccurate: boolean) => {
    startTransition(async () => {
      try {
        await updateAccuracy(recordId, isAccurate);
        // console.log('Cập nhật thành công'); // ✅ Thay alert bằng console.log
      } catch {
        // console.error('Lỗi:', e); // ✅ Thay alert bằng console.error
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Khu vực Inspector */}
      {showEdit && (
        <div className="mt-4 border-t pt-4">
          <p className="mb-2 text-xs font-bold uppercase text-blue-600">
            Khu vực Inspector
            {' '}
            {isPending && '(Đang xử lý...)'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAccuracy(true)}
              type="button" // ✅ Đã thêm type
              disabled={isPending}
              className="flex items-center justify-center gap-2 rounded border border-green-500 bg-white py-2 font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-50"
            >
              ✅ Đúng
            </button>
            <button
              onClick={() => handleAccuracy(false)}
              type="button" // ✅ Đã thêm type
              disabled={isPending}
              className="flex items-center justify-center gap-2 rounded border border-red-500 bg-white py-2 font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              ❌ Sai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Component nút Approve riêng (Dùng trên Header)
export function ApproveButton({ recordId }: { recordId: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => approveRecord(recordId))}
      type="button" // ✅ Đã thêm type
      disabled={isPending}
      className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-50"
    >
      {isPending ? 'Đang lưu...' : '✓ Phê Duyệt Ngay'}
    </button>
  );
}
