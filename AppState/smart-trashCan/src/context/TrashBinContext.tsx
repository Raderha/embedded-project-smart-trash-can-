// import React, { createContext, useState, ReactNode } from 'react';
// import { TrashBinStatus } from '../types/TrashBin';
// import initialBins from '../data/bins';

// interface TrashBinContextType {
//   bins: TrashBinStatus[];
//   updateBin: (updatedBin: TrashBinStatus) => void;
// }

// export const TrashBinContext = createContext<TrashBinContextType>({
//   bins: [],
//   updateBin: () => {},
// });

// export const TrashBinProvider = ({ children }: { children: ReactNode }) => {
//   const [bins, setBins] = useState<TrashBinStatus[]>(initialBins);

//   const updateBin = (updatedBin: TrashBinStatus) => {
//     setBins((prevBins) =>
//       prevBins.map((bin) => (bin.id === updatedBin.id ? updatedBin : bin))
//     );
//   };

//   return (
//     <TrashBinContext.Provider value={{ bins, updateBin }}>
//       {children}
//     </TrashBinContext.Provider>
//   );
// };
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

export const TrashBinProvider = ({ children }: { children: ReactNode }) => {
  const [bins, setBins] = useState<TrashBinStatus[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrashBins();
      setBins(data);
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