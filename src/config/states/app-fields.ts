import { atom } from 'recoil';
import { Properties } from '@kintone/rest-api-client/lib/client/types';

const state = atom<Properties | null>({
  key: 'appFieldsState',
  default: null,
});

export default state;
