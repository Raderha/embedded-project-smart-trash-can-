// src/services/api.ts
import { TrashBinStatus } from '../types/TrashBin';

const API_URL = 'http://192.168.0.18:8000/api/bins';

/**
 * 서버에서 모든 쓰레기통 상태를 받아옵니다.
 */
export const getTrashBins = async (): Promise<TrashBinStatus[]> => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    // console.error('🚨 getTrashBins 오류:', error);
    return []; // 실패 시 빈 배열 반환
  }
};

/**
 * 특정 쓰레기통의 상태를 업데이트합니다.
 * @param id 쓰레기통 ID
 * @param updatedBin 변경할 필드들
 */
export const updateBin = async (
  id: string,
  updatedBin: Partial<TrashBinStatus>
) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBin),
    });
  } catch (error) {
    console.error(`🚨 updateBin(${id}) 오류:`, error);
  }
};