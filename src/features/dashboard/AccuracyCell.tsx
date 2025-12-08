// /src/features/dashboard/AccuracyCell.tsx

'use client';

import { useState } from 'react';

import { updateAccuracy } from '@/actions/updateAccuracy';

type Props = {
  recordId: number;
  isAccurate: boolean | null;
  canEdit: boolean;
};

export default function AccuracyCell({ recordId, isAccurate, canEdit }: Props) {
  const [localValue, setLocalValue] = useState(isAccurate);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (newValue: boolean) => {
    if (isUpdating) {
      return;
    } // Prevent double-click

    const oldValue = localValue;
    setLocalValue(newValue); // Optimistic update
    setIsUpdating(true);

    try {
      await updateAccuracy(recordId, newValue);
    } catch (error) {
      // Rollback on error
      setLocalValue(oldValue);
      // Thay alert bằng console.error để không bị chặn commit
      console.error('Lỗi cập nhật:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Trường hợp 1: Chưa có giá trị
  if (localValue === null) {
    return (
      <span className="text-xs text-gray-400">
        Chưa kiểm định
      </span>
    );
  }

  // Trường hợp 2: Không có quyền edit → hiển thị text tĩnh
  if (!canEdit) {
    return localValue
      ? (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
            Đúng
          </span>
        )
      : (
          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
            Sai
          </span>
        );
  }

  // Trường hợp 3: Có quyền edit → hiển thị buttons
  // SỬA LỖI: Bỏ onClick ở thẻ div cha để tránh lỗi a11y
  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isUpdating}
        onClick={(e) => {
          e.stopPropagation(); // Chặn sự kiện nổi bọt lên Row tại đây
          handleChange(true);
        }}
        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
          localValue === true
            ? 'bg-green-600 text-white'
            : 'border border-green-600 text-green-600 hover:bg-green-50'
        } ${isUpdating ? 'cursor-wait opacity-50' : 'cursor-pointer'}`}
      >
        ✓ Đúng
      </button>

      <button
        type="button"
        disabled={isUpdating}
        onClick={(e) => {
          e.stopPropagation(); // Chặn sự kiện nổi bọt lên Row tại đây
          handleChange(false);
        }}
        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
          localValue === false
            ? 'bg-red-600 text-white'
            : 'border border-red-600 text-red-600 hover:bg-red-50'
        } ${isUpdating ? 'cursor-wait opacity-50' : 'cursor-pointer'}`}
      >
        ✗ Sai
      </button>
    </div>
  );
}
