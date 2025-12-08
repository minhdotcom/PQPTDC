// /src/actions/updateAccuracy.ts

'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/libs/DB';
import { canEditAccuracy, getCurrentUser } from '@/libs/Permissions';
import { anpr_records } from '@/models/Schema';

export async function updateAccuracy(recordId: number, isAccurate: boolean) {
  // Check permission
  const canEdit = await canEditAccuracy();
  if (!canEdit) {
    throw new Error('Không có quyền chỉnh sửa');
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Chưa đăng nhập');
  }

  // Update database
  await db
    .update(anpr_records)
    .set({
      is_accurate: isAccurate,
      inspected_by: `user_${user.role}`,
      inspected_at: new Date(),
      status: 'inspected',
    })
    .where(eq(anpr_records.id, recordId));

  // Refresh dashboard để hiển thị data mới
  revalidatePath('/dashboard');

  return { success: true };
}
