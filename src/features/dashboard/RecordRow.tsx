// /src/features/dashboard/RecordRow.tsx

import { canEditAccuracy } from '@/libs/Permissions';

import RecordRowClient from './RecordRowClient';

type IRecordRowProps = {
  id: number;
  created_at: Date | null;
  plate_wim: string | null;
  plate_camera: string | null;
  thumbnail_url: string | null;
  is_accurate: boolean | null;
  status: string | null;
};

export default async function RecordRow(props: IRecordRowProps) {
  const canEdit = await canEditAccuracy();

  return (
    <RecordRowClient {...props} canEdit={canEdit} />
  );
}
