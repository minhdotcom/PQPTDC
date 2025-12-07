// /src/actions/RecordActions.ts

'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/libs/DB';
import { canApprove, canEditAccuracy } from '@/libs/Permissions';
import { anpr_records } from '@/models/Schema';

// 1. Action: Cập nhật độ chính xác (Dành cho Inspector)
export async function updateAccuracy(recordId: number, isAccurate: boolean) {
  // Check quyền (Bảo mật 2 lớp: UI ẩn rồi, Server check lại lần nữa)
  const allowed = await canEditAccuracy();
  if (!allowed) {
    throw new Error('Không có quyền thực hiện (Unauthorized)');
  }

  const { userId } = await auth(); // Lấy ID người đang thao tác

  // Update DB
  await db
    .update(anpr_records)
    .set({
      is_accurate: isAccurate,
      inspected_by: userId || 'unknown',
      inspected_at: new Date(),
      status: 'reviewed', // Tự động chuyển trạng thái thành Đã Review
    })
    .where(eq(anpr_records.id, recordId));

  // Refresh lại dữ liệu trang để User thấy ngay thay đổi
  revalidatePath(`/dashboard/${recordId}`);
  revalidatePath('/dashboard');
}

// 2. Action: Phê duyệt (Dành cho Manager)
export async function approveRecord(recordId: number) {
  const allowed = await canApprove();
  if (!allowed) {
    throw new Error('Không có quyền phê duyệt');
  }

  const { userId } = await auth();

  await db
    .update(anpr_records)
    .set({
      status: 'approved',
      approved_by: userId || 'unknown',
      approved_at: new Date(),
    })
    .where(eq(anpr_records.id, recordId));

  revalidatePath(`/dashboard/${recordId}`);
  revalidatePath('/dashboard');
}
