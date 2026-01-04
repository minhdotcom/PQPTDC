import { getDb } from '../src/libs/DB';
import { anpr_records } from '../src/models/Schema';

async function seed() {
  const db = await getDb();
  // console.log('Seeding 3 sample records...');

  await db.insert(anpr_records).values([
    {
      plate_wim: '59A-12345',
      plate_camera: '59A-12345',
      confidence_wim: '95.50',
      confidence_camera: '99.20',
      image_wim_url: 'https://picsum.photos/id/1/800/600',
      image_camera_url: 'https://picsum.photos/id/2/800/600',
      thumbnail_url: 'https://picsum.photos/id/1/200/150',
      status: 'approved',
      is_accurate: true,
      reviewed_by: 'user_admin',
      reviewed_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
      notes: 'Khớp hoàn hảo',
      organization_id: 'station_01',
    },
    {
      plate_wim: '51H-67890',
      plate_camera: '51H-67891',
      confidence_wim: '94.30',
      confidence_camera: '98.10',
      image_wim_url: 'https://picsum.photos/id/10/800/600',
      image_camera_url: 'https://picsum.photos/id/11/800/600',
      thumbnail_url: 'https://picsum.photos/id/10/200/150',
      status: 'pending',
      is_accurate: false,
      notes: 'Biển số khác nhau',
      organization_id: 'station_02',
    },
    {
      plate_wim: '30E-55555',
      plate_camera: '30E-55555',
      confidence_wim: '96.80',
      confidence_camera: '99.90',
      image_wim_url: 'https://picsum.photos/id/20/800/600',
      image_camera_url: 'https://picsum.photos/id/21/800/600',
      thumbnail_url: 'https://picsum.photos/id/20/200/150',
      status: 'reviewed',
      is_accurate: true,
      reviewed_by: 'user_staff',
      reviewed_at: new Date(Date.now() - 60 * 60 * 1000),
      notes: 'Cần phê duyệt',
      organization_id: 'station_03',
    },
  ]);

  // console.log('Seed completed! 3 records added.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
