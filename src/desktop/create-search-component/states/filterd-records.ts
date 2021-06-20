import { selector } from 'recoil';
import { lookupRecordsState, pluginConditionState, searchInputState } from '.';

const state = selector<any[]>({
  key: 'filterdRecordsState',
  get: ({ get }) => {
    const records = get(lookupRecordsState);
    const input = get(searchInputState);
    const condition = get(pluginConditionState);

    if (!input) {
      return records;
    }

    const targets = records.filter((record) =>
      condition?.sees.some((code) => record[code].value && ~record[code].value.indexOf(input))
    );

    return targets;
  },
});

export default state;
