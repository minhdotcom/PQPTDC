// /src/features/dashboard/ApproveButton.tsx

'use client';

import { useState } from 'react';

import { approveRecord } from '@/actions/approveRecord';

type Props = {
  recordId: number;
  currentStatus: string | null;
  canApprove: boolean;
};

export default function ApproveButton({ recordId, currentStatus, canApprove }: Props) {
  const [isApproving, setIsApproving] = useState(false);

  // console.log('ApproveButton:', { recordId, currentStatus, canApprove }); // ← THÊM

  // Không hiển thị nếu không có quyền
  if (!canApprove) {
    return null;
  }

  // Không hiển thị nếu đã approved
  if (currentStatus === 'approved') {
    return null;
  }

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Không trigger row click

    if (isApproving) {
      return;
    }

    // const confirm = window.confirm('Xác nhận phê duyệt record này?');
    // if (!confirm) return;

    setIsApproving(true);

    try {
      await approveRecord(recordId);
    } catch {
      // alert(error instanceof Error ? error.message : 'Lỗi phê duyệt');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isApproving}
      onClick={handleApprove}
      className={`rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 ${
        isApproving ? 'cursor-wait opacity-50' : ''
      }`}
    >
      {isApproving ? '⏳ Đang xử lý...' : '✓ Phê duyệt'}
    </button>
  );
}
