// /src/app/[locate]/auth/dashboard/page.tsx

import { desc, eq } from 'drizzle-orm';

import RecordRow from '@/features/dashboard/RecordRow';
import { db } from '@/libs/DB';
import { getFilteredOrganizationId } from '@/libs/Permissions';
import { anpr_records } from '@/models/Schema';

export default async function DashboardPage() {
  const orgId = await getFilteredOrganizationId();

  // 1. Tạo câu query gốc (Base Query)
  // TypeScript sẽ hiểu rõ kiểu dữ liệu của biến này ngay từ đầu
  const baseQuery = db
    .select()
    .from(anpr_records)
    .orderBy(desc(anpr_records.created_at))
    .limit(50);

  // 2. Logic phân nhánh:
  // Nếu có orgId -> nối thêm where. Nếu không -> chạy baseQuery gốc.
  // Cách này đảm bảo Type Safety tuyệt đối mà không cần dùng "any"
  const records = orgId
    ? await baseQuery.where(eq(anpr_records.organization_id, orgId))
    : await baseQuery;

  return (
    <div className="p-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        ANPR Verification Records
      </h1>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">STT</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Thời gian</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Biển WIM</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Biển Camera</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Thumbnail</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">KQ Kiểm định</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {records.map((r, i) => (
              <RecordRow
                key={r.id}
                index={i}
                id={r.id}
                created_at={r.created_at}
                plate_wim={r.plate_wim}
                plate_camera={r.plate_camera}
                thumbnail_url={r.thumbnail_url}
                is_accurate={r.is_accurate}
                status={r.status}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
