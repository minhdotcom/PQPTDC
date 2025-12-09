// /src/actions/approveRecord.ts

'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/libs/DB';
import { canApprove, getCurrentUser } from '@/libs/Permissions';
import { anpr_records } from '@/models/Schema';

export async function approveRecord(recordId: number) {
  // Check permission
  const canApproveRecord = await canApprove();
  if (!canApproveRecord) {
    throw new Error('Không có quyền phê duyệt');
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Chưa đăng nhập');
  }

  // Update database
  await db
    .update(anpr_records)
    .set({
      status: 'approved',
      approved_by: `user_${user.role}`,
      approved_at: new Date(),
    })
    .where(eq(anpr_records.id, recordId));

  // Refresh dashboard
  revalidatePath('/dashboard');

  return { success: true };
}
