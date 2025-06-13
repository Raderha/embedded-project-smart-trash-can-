import { TrashBinStatus } from '../types/TrashBin';

const initialBins: TrashBinStatus[] = [
  // 1층
  {
    id: 'bin1',
    floor: '1층',
    location: '입구 옆',
    fillLevel: 85,
    status: '정상',
    isFireDetected: false,
    assignedUser: null,
  },
  {
    id: 'bin2',
    floor: '1층',
    location: '복도 중앙',
    fillLevel: 20,
    status: '정상',
    isFireDetected: true,
    assignedUser: 'A',
  },
  {
    id: 'bin3',
    floor: '1층',
    location: '화장실 옆',
    fillLevel: 55,
    status: '정상',
    isFireDetected: false,
    assignedUser: null,
  },

  // 2층
  {
    id: 'bin4',
    floor: '2층',
    location: '엘리베이터 앞',
    fillLevel: 75,
    status: '정상',
    isFireDetected: false,
    assignedUser: null,
  },
  {
    id: 'bin5',
    floor: '2층',
    location: '화장실 옆',
    fillLevel: 90,
    status: '수거 예정',
    isFireDetected: false,
    assignedUser: 'B',
  },
  {
    id: 'bin6',
    floor: '2층',
    location: '계단 옆',
    fillLevel: 60,
    status: '정상',
    isFireDetected: false,
    assignedUser: null,
  },

  // 3층
  {
    id: 'bin7',
    floor: '3층',
    location: '복도 끝',
    fillLevel: 10,
    status: '정상',
    isFireDetected: true,
    assignedUser: null,
  },
  {
    id: 'bin8',
    floor: '3층',
    location: '계단 옆',
    fillLevel: 40,
    status: '정상',
    isFireDetected: false,
    assignedUser: null,
  },
  {
    id: 'bin9',
    floor: '3층',
    location: '강의실 앞',
    fillLevel: 95,
    status: '정상',
    isFireDetected: false,
    assignedUser: null,
  },

  // 4층
  {
    id: 'bin10',
    floor: '4층',
    location: '복도 중앙',
    fillLevel: 35,
    status: '정상',
    isFireDetected: false,
    assignedUser: null,
  },
  {
    id: 'bin11',
    floor: '4층',
    location: '계단 옆',
    fillLevel: 15,
    status: '정상',
    isFireDetected: true,
    assignedUser: 'B',
  },

  // 5층
  {
    id: 'bin12',
    floor: '5층',
    location: '화장실 앞',
    fillLevel: 45,
    status: '수거 예정',
    isFireDetected: false,
    assignedUser: 'A',
  },
  {
    id: 'bin13',
    floor: '5층',
    location: '엘리베이터 앞',
    fillLevel: 100,
    status: '정상',
    isFireDetected: false,
    assignedUser: null,
  },
  {
    id: 'bin14',
    floor: '5층',
    location: '계단 밑',
    fillLevel: 5,
    status: '정상',
    isFireDetected: true,
    assignedUser: null,
  }
];

export default initialBins;
