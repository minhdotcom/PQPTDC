import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import RecordActionButtons, { ApproveButton } from '@/features/dashboard/RecordActionButtons';
import { db } from '@/libs/DB';
import { canApprove, canEditAccuracy } from '@/libs/Permissions';
import { anpr_records } from '@/models/Schema';

export default async function RecordDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recordId = Number(params.id);

  // FIX 1: Dùng Number.isNaN thay vì isNaN
  if (Number.isNaN(recordId)) {
    notFound();
  }

  // 1. Fetch Data
  const record = await db.query.anpr_records.findFirst({
    where: eq(anpr_records.id, recordId),
  });

  if (!record) {
    notFound();
  }

  // 2. Fetch Permissions
  const showEdit = await canEditAccuracy();
  const showApprove = await canApprove();

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* --- HEADER --- */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-2 inline-block text-sm text-gray-500 hover:text-blue-600 hover:underline"
          >
            ← Quay lại danh sách
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {record.plate_camera || 'Unknown Plate'}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${
                record.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {(record.status || 'PENDING').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Chỉ hiện nút Duyệt nếu là Manager/Admin */}
        {showApprove && (
          <ApproveButton recordId={record.id} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* --- CỘT TRÁI: HÌNH ẢNH --- */}
        <div className="space-y-6 lg:col-span-2">
          {/* Ảnh WIM */}
          <div className="rounded-xl border bg-white p-4 shadow">
            <h3 className="mb-3 flex justify-between font-semibold text-gray-700">
              <span>📸 Ảnh 1</span>
              <span className="font-mono text-blue-600">{record.plate_wim}</span>
            </h3>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
              {/* FIX 3: Format toán tử 3 ngôi xuống dòng */}
              {record.image_wim_url
                ? (
                  // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={record.image_wim_url}
                      alt="WIM"
                      className="size-full object-cover"
                    />
                  )
                : (
                    <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
                  )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Độ tin cậy:
              {' '}
              <span className="font-bold text-gray-900">
                {record.confidence_wim}
                %
              </span>
            </p>
          </div>

          {/* Ảnh Camera */}
          <div className="rounded-xl border bg-white p-4 shadow">
            <h3 className="mb-3 flex justify-between font-semibold text-gray-700">
              <span>📸 Ảnh 2</span>
              <span className="font-mono text-green-600">{record.plate_camera}</span>
            </h3>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
              {/* FIX 3: Format toán tử 3 ngôi xuống dòng */}
              {record.image_camera_url
                ? (
                  // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={record.image_camera_url}
                      alt="Camera"
                      className="size-full object-cover"
                    />
                  )
                : (
                    <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
                  )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Độ tin cậy:
              {' '}
              <span className="font-bold text-gray-900">
                {record.confidence_camera}
                %
              </span>
            </p>
          </div>
        </div>

        {/* --- CỘT PHẢI: THÔNG TIN & ĐÁNH GIÁ --- */}
        <div className="space-y-6 lg:col-span-1">

          {/* Card 1: Kết quả kiểm định */}
          <div className="rounded-xl border border-blue-100 bg-white p-6 shadow">
            <h3 className="mb-4 border-b pb-2 text-lg font-bold text-gray-900">
              Kết quả kiểm định
            </h3>

            <div className="space-y-4">
              <div>
                {/* FIX 4: Đổi label thành span */}
                <span className="block text-xs font-semibold uppercase text-gray-500"> </span>
                <div className="mt-2">
                  {record.is_accurate === null
                    ? (
                        <span className="italic text-gray-400">Chưa đánh giá</span>
                      )
                    : record.is_accurate
                      ? (
                          <div className="flex items-center rounded bg-green-50 p-2 font-bold text-green-600">
                            <span className="mr-2">✅</span>
                            {' '}
                            Chính xác
                          </div>
                        )
                      : (
                          <div className="flex items-center rounded bg-red-50 p-2 font-bold text-red-600">
                            <span className="mr-2">❌</span>
                            {' '}
                            Sai lệch
                          </div>
                        )}
                </div>
              </div>

              {/* ACTION ZONE */}
              <RecordActionButtons
                recordId={record.id}
                showEdit={showEdit}
              />
            </div>
          </div>

          {/* Card 2: Meta info */}
          <div className="rounded-xl border bg-gray-50 p-6">
            <h4 className="mb-3 text-sm font-bold text-gray-700">Thông tin hệ thống</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>ID:</span>
                {' '}
                <span className="font-mono">{record.id}</span>
              </li>
              <li className="flex justify-between">
                <span>Trạm:</span>
                {' '}
                <span className="font-mono">{record.organization_id}</span>
              </li>
              <li className="flex justify-between">
                <span>Thời gian:</span>
                <span>{record.created_at ? new Date(record.created_at).toLocaleString('vi-VN') : '-'}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
