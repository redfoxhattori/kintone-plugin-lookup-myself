import { Properties } from '@kintone/rest-api-client/lib/client/types';
import { selector } from 'recoil';
import { appFieldsState } from '.';

const state = selector({
  key: 'singleLineFieldsState',
  get: ({ get }) => {
    const fields = get(appFieldsState);

    if (!fields) {
      return null;
    }

    const filterd = Object.entries(fields).reduce<Partial<Properties>>((acc, [key, value]) => {
      if (value.type !== 'SINGLE_LINE_TEXT') {
        return acc;
      }
      return { ...acc, [key]: value };
    }, {});

    return filterd;
  },
});

export default state;
