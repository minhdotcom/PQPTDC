// src/app/[locale]/(auth)/dashboard/user-profile/[[...user-profile]]/page.tsx

import { UserProfile } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
// 1. Đổi import từ hook sang server function
import { getTranslations } from 'next-intl/server';

// Component Import
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getI18nPath } from '@/utils/Helpers';

const UserProfilePage = async (props: { params: { locale: string } }) => {
  // 2. Dùng await getTranslations thay vì useTranslations
  const t = await getTranslations({ locale: props.params.locale, namespace: 'UserProfile' });

  // Fetch data từ Server
  const { sessionClaims } = await auth();

  // Ép kiểu an toàn
  const publicMetadata = (sessionClaims?.publicMetadata || {}) as {
    role?: string;
    organization_id?: string;
  };

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cột chính: Clerk UserProfile */}
        <div className="lg:col-span-2">
          <UserProfile
            routing="path"
            path={getI18nPath('/dashboard/user-profile', props.params.locale)}
            appearance={{
              elements: {
                rootBox: 'w-full',
                cardBox: 'w-full shadow-sm border',
                navbar: 'hidden',
              },
            }}
          />
        </div>

        {/* Cột phụ: Role + Organization */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-6 border-b pb-2 text-lg font-bold text-gray-900">
              Thông tin phân quyền
            </h3>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Vai trò (Role)
                </span>
                <div className="mt-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${
                    publicMetadata.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : publicMetadata.role === 'manager'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                  >
                    {(publicMetadata.role || 'Staff').toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Đơn vị quản lý
                </span>
                <div className="mt-2">
                  <code className="block w-full overflow-hidden text-ellipsis rounded-md bg-gray-800 px-3 py-2 font-mono text-sm text-white">
                    {publicMetadata.organization_id || 'Chưa gán'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
