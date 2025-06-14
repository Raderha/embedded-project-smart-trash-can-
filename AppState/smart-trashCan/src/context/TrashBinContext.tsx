// src/context/TrashBinContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { TrashBinStatus } from '../types/TrashBin';
import { getTrashBins } from '../services/api';

interface TrashBinContextType {
  bins: TrashBinStatus[];
  updateBin: (bin: TrashBinStatus) => void;
  setBins: React.Dispatch<React.SetStateAction<TrashBinStatus[]>>;
}

export const TrashBinContext = createContext<TrashBinContextType>({
  bins: [],
  updateBin: () => {},
  setBins: () => {},
});

// ✅ 층별 더미 데이터 (id는 dummy_층_번호 형식)
const generateDummyData = (): TrashBinStatus[] => {
  const floors = ['1층', '2층', '4층', '5층']; // 3층 제외
  const dummy: TrashBinStatus[] = [];

  floors.forEach((floor, fIndex) => {
    for (let i = 1; i <= 5; i++) {
      const id = `dummy_${fIndex + 1}_${i}`;
      const location = `${floor} ${String.fromCharCode(64 + i)}구역`; // A, B, C, D, E 구역
      const fill = Math.floor(Math.random() * 100);
      dummy.push({
        id,
        floor,
        location,
        fillLevel: fill,
        status: fill > 80 ? '수거 예정' : '정상',
        isFireDetected: false,
        assignedUser: undefined,
      });
    }
  });

  return dummy;
};

export const TrashBinProvider = ({ children }: { children: ReactNode }) => {
  const [bins, setBins] = useState<TrashBinStatus[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serverBins = await getTrashBins();
        const dummyBins = generateDummyData();

        // 서버 데이터와 id가 겹치지 않도록 필터링
        const merged = [
          ...serverBins,
          ...dummyBins.filter((dummy) => !serverBins.some((b) => b.id === dummy.id)),
        ];

        setBins(merged);
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error);
        // 오류 발생 시 더미 데이터만 표시
        setBins(generateDummyData());
      }
    };

    fetchData();
  }, []);

  const updateBin = (updated: TrashBinStatus) => {
    setBins((prev) => {
      const exists = prev.some((b) => b.id === updated.id);
      if (exists) {
        return prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b));
      } else {
        return [...prev, updated];
      }
    });
  };

  return (
    <TrashBinContext.Provider value={{ bins, updateBin, setBins }}>
      {children}
    </TrashBinContext.Provider>
  );
};