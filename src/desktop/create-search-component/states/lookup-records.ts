import { atom } from 'recoil';

const state = atom<any[]>({
  key: 'lookupRecordsState',
  default: [],
});

export default state;
