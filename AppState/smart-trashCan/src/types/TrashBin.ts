// // 📁 src/types/TrashBin.ts
// export interface TrashBinStatus {
//   id: string;
//   floor: number;
//   location: string;
//   fillLevel: number;
//   isFireDetected: boolean;
//   status: '정상' | '수거 예정';
//   manager?: string;
// }
export interface TrashBinStatus {
  id: string;
  floor: string;
  location: string;
  fillLevel: number;
  status: '정상' | '수거 예정';
  isFireDetected: boolean;
  assignedUser?: string;
  lastCollectedAt?: string;
}
