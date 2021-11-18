import { someRecord } from '@common/kintone-api';
import { selector } from 'recoil';
import { searchInputState, srcAllRecordsState } from '.';

const state = selector<any[]>({
  key: 'filteredRecordsState',
  get: ({ get }) => {
    const cachedRecords = get(srcAllRecordsState);
    const input = get(searchInputState);

    const words = input.split(/\s+/g);

    return cachedRecords.filter((record) => words.every((word) => someRecord(record, word)));
  },
});

export default state;
