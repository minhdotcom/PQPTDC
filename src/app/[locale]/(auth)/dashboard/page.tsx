// /src/app/[locate]/auth/dashboard/page.tsx

import { desc, eq } from 'drizzle-orm';
import Image from 'next/image';

import { db } from '@/libs/DB';
import { getFilteredOrganizationId } from '@/libs/Permissions';
import { anpr_records } from '@/models/Schema';

export default async function DashboardPage() {
  const orgId = await getFilteredOrganizationId();

  // Build query with organization filter
  let query = db
    .select()
    .from(anpr_records)
    .orderBy(desc(anpr_records.created_at))
    .limit(50);

  // If not admin, filter by organization
  if (orgId) {
    query = query.where(eq(anpr_records.organization_id, orgId)) as any;
  }

  const records = await query;

  return (
    <div className="p-10">
      <h1 className="mb-8 text-center text-4xl font-bold">
        ANPR Verification Records
      </h1>

      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">STT</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Thời gian</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Biển WIM</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Biển Camera</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Thumbnail</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">KQ kiểm định</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((r, i) => (
              <tr key={r.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{i + 1}</td>
                <td className="px-6 py-4 font-mono text-sm text-gray-500">
                  #
                  {r.id}
                </td>
                <td className="px-6 py-4 text-sm">
                  {r.created_at ? new Date(r.created_at).toLocaleString('vi-VN') : '-'}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-blue-700">{r.plate_wim}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-700">{r.plate_camera}</td>
                <td className="px-6 py-4">
                  {r.thumbnail_url
                    ? (
                        <Image
                          src={r.thumbnail_url}
                          alt="thumb"
                          width={120}
                          height={80}
                          className="rounded-lg object-cover shadow"
                        />
                      )
                    : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                </td>
                <td className="px-6 py-4 text-center">
                  {r.is_accurate === null
                    ? (
                        <span className="text-xs text-gray-400">Chưa kiểm định</span>
                      )
                    : r.is_accurate
                      ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                            Đúng
                          </span>
                        )
                      : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                            Sai
                          </span>
                        )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      r.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : r.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {r.status || 'pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
