import { selector } from 'recoil';

const state = selector<string>({
  key: 'dialogTitleState',
  get: async ({ get }) => {
    return '同一アプリから情報を取得';
  },
});

export default state;
