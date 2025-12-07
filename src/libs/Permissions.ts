// /src/libs/Permissions.ts

import { auth } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'manager' | 'inspector' | 'staff';

type UserMetadata = {
  role: UserRole;
  organization_id: string;
};

/**
 * Lấy role và organization_id của user hiện tại
 */
export async function getCurrentUser(): Promise<UserMetadata | null> {
  const { userId, sessionClaims } = await auth();

  if (!userId || !sessionClaims) {
    return null;
  }

  const publicMetadata = sessionClaims.publicMetadata as {
    role?: UserRole;
    organization_id?: string;
  };

  return {
    role: publicMetadata?.role || 'staff',
    organization_id: publicMetadata?.organization_id || '',
  };
}

/**
 * Kiểm tra user có quyền sửa is_accurate không
 */
export async function canEditAccuracy(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  return ['admin', 'manager', 'inspector'].includes(user.role);
}

/**
 * Kiểm tra user có quyền phê duyệt không
 */
export async function canApprove(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  return ['admin', 'manager'].includes(user.role);
}

/**
 * Kiểm tra user có quyền xem tất cả trạm không
 */
export async function canViewAllStations(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  return user.role === 'admin';
}

/**
 * Lấy organization_id để filter data
 * - Admin: null (xem tất cả)
 * - Others: organization_id của user
 */
export async function getFilteredOrganizationId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  if (user.role === 'admin') {
    return null; // Admin xem tất cả
  }

  return user.organization_id;
}
