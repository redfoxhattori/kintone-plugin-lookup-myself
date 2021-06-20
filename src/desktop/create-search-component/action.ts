import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { SetterOrUpdater } from 'recoil';

import { getAppId, getCurrentRecord, setCurrentRecord } from '@common/kintone';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';

type EnqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject | undefined
) => SnackbarKey;

export const lookup = async (
  enqueueSnackbar: EnqueueSnackbar,
  setShown: SetterOrUpdater<boolean>,
  setRecords: SetterOrUpdater<any[]>,
  condition: kintone.plugin.Condition
) => {
  const { record } = getCurrentRecord();

  const value = record[condition.target].value;

  const references = await getRecords(value, condition);

  if (!references.length) {
    enqueueSnackbar('対象データが見つかりませんでした。', { variant: 'error' });
    return;
  } else if (references.length === 1) {
    apply(references[0], condition);
    enqueueSnackbar('参照先からデータが取得されました。', { variant: 'success' });
    return;
  }

  setRecords(references);
  setShown(true);
};

export const apply = (selected: any, condition: kintone.plugin.Condition) => {
  const { record } = getCurrentRecord()!;

  record[condition.target].value = selected[condition.related].value;
  for (const { from, to } of condition.copies) {
    record[to].value = selected[from].value;
  }

  setCurrentRecord({ record });
};

export const clearLookup = (condition: kintone.plugin.Condition) => {
  const { record } = getCurrentRecord()!;

  record[condition.target].value = '';
  for (const { to } of condition.copies) {
    record[to].value = '';
  }

  setCurrentRecord({ record });
};

const getRecords = async (value: string, condition: kintone.plugin.Condition): Promise<any[]> => {
  const client = new KintoneRestAPIClient();

  const app = getAppId();

  if (!app) {
    throw new Error('アプリ情報の取得に失敗したため、ルックアップを実行できませんでした。');
  }

  const query = value ? `${condition.related} like "${value}"` : '';

  const fields = [
    ...new Set(
      [condition.copies.map(({ from }) => from), condition.sees, condition.related].flat()
    ),
  ];

  return client.record.getAllRecordsWithCursor({ app, query, fields });
};
