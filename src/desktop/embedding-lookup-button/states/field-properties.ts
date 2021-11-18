import { getFieldProperties } from '@common/kintone-api';
import { selector } from 'recoil';

export const fieldPropertiesState = selector({
  key: 'fieldPropertiesState',
  get: async ({ get }) => {
    const properties = await getFieldProperties();
    return Object.values(properties);
  },
});
