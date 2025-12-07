// src/libs/Permissions.ts

// 👇 QUAN TRỌNG: Đổi import từ auth sang currentUser
import { currentUser } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'manager' | 'inspector' | 'staff';

type UserMetadata = {
  role: UserRole;
  organization_id: string;
};

export async function getCurrentUser(): Promise<UserMetadata | null> {
  // 👇 QUAN TRỌNG: Gọi thẳng lên Server Clerk lấy data mới nhất
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const publicMetadata = user.publicMetadata as {
    role?: UserRole;
    organization_id?: string;
  };

  return {
    role: publicMetadata?.role || 'staff',
    organization_id: publicMetadata?.organization_id || '',
  };
}

// ... Các hàm bên dưới (canEditAccuracy, canApprove...) giữ nguyên
export async function canEditAccuracy(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  return ['admin', 'manager', 'inspector'].includes(user.role);
}

export async function canApprove(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  return ['admin', 'manager'].includes(user.role);
}

export async function canViewAllStations(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  return user.role === 'admin';
}

export async function getFilteredOrganizationId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  if (user.role === 'admin') {
    return null;
  }
  return user.organization_id;
}
