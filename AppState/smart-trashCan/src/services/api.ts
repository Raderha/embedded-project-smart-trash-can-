// import { TrashBinStatus } from '../types/TrashBin';

// let bins: TrashBinStatus[] = [];

// // 각 층에 5개씩, 총 25개. 화재 6개 포함
// for (let floor = 1; floor <= 5; floor++) {
//   for (let i = 1; i <= 5; i++) {
//     const id = `bin${(floor - 1) * 5 + i}`;
//     bins.push({
//       id,
//       floor: `${floor}층`,
//       location: `위치 ${i}`,
//       fillLevel: Math.floor(Math.random() * 101), // 0~100%
//       status: '정상',
//       isFireDetected: false,
//       assignedUser: null,
//     });
//   }
// }

// // 화재 쓰레기통 6개 설정 (임의 선택)
// [1, 7, 10, 13, 18, 24].forEach(index => {
//   bins[index].isFireDetected = true;
//   bins[index].status = '화재';
// });

// export async function getTrashBins(): Promise<TrashBinStatus[]> {
//   return bins;
// }

// export async function updateBin(id: string, changes: Partial<TrashBinStatus>) {
//   const index = bins.findIndex(b => b.id === id);
//   if (index >= 0) {
//     bins[index] = { ...bins[index], ...changes };
//   }
// }

// export async function markAsScheduled(id: string, user: string) {
//   await updateBin(id, { status: '수거 예정', assignedUser: user });
// }

// export async function completeCollection(id: string) {
//   await updateBin(id, { fillLevel: 0, status: '정상', assignedUser: null });
// }

// export async function resolveFire(id: string) {
//   const bin = bins.find(b => b.id === id);
//   if (!bin) return;
//   const newStatus = bin.assignedUser ? '수거 예정' : '정상';
//   await updateBin(id, { isFireDetected: false, status: newStatus });
// }
import { TrashBinStatus } from '../types/TrashBin';

const API_URL = 'http://202.30.49.84:3000/api/bins';

export const getTrashBins = async (): Promise<TrashBinStatus[]> => {
  const res = await fetch(API_URL);
  return res.json();
};

export const updateBin = async (
  id: string,
  updatedBin: Partial<TrashBinStatus>
) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBin),
  });
};
