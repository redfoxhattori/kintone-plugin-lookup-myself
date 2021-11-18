import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { SetterOrUpdater } from 'recoil';

import { getAppId, getCurrentRecord, setCurrentRecord } from '@common/kintone';
import { getAllRecords } from '@common/kintone-rest-api';
import { Record as KintoneRecord } from '@kintone/rest-api-client/lib/client/types';
import { someFieldValue } from '@common/kintone-api';

type EnqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject | undefined
) => SnackbarKey;

export const lookup = async (
  input: string,
  hasCached: boolean,
  cachedRecords: KintoneRecord[],
  enqueueSnackbar: EnqueueSnackbar,
  setShown: SetterOrUpdater<boolean>,
  setLookuped: SetterOrUpdater<boolean>,
  condition: kintone.plugin.Condition
) => {
  // 全レコードのキャッシュが取得済みであれば、キャッシュから対象レコードを検索します
  // 対象レコードが１件だけであれば、ルックアップ対象を確定します
  if (hasCached) {
    const filtered = cachedRecords.filter((r) => someFieldValue(r[condition.related], input));

    if (filtered.length === 1) {
      apply(filtered[0], condition, enqueueSnackbar, setLookuped);
      return;
    }
  }

  const { record } = getCurrentRecord();

  const value = record[condition.target].value as string;

  const app = getAppId()!;
  const query = value ? `${condition.related} like "${value}"` : '';
  const fields = getLookupSrcFields(condition);

  let onlyOneRecord = true;
  const lookupRecords = await getAllRecords({
    app,
    query,
    fields,
    onTotalGet: (total) => {
      if (total !== 1) {
        setShown(true);
        onlyOneRecord = false;
      }
    },
  });
  if (!onlyOneRecord) {
    return;
  }

  apply(lookupRecords[0], condition, enqueueSnackbar, setLookuped);
};

export const getLookupSrcFields = (condition: kintone.plugin.Condition) => {
  const fields = [
    ...new Set(
      [condition.copies.map(({ from }) => from), condition.sees, condition.related].flat()
    ),
  ];
  return fields;
};

export const apply = (
  selected: KintoneRecord,
  condition: kintone.plugin.Condition,
  enqueueSnackbar: EnqueueSnackbar,
  setLookuped: SetterOrUpdater<boolean>
) => {
  const { record } = getCurrentRecord()!;

  record[condition.target].value = selected[condition.related].value;
  for (const { from, to } of condition.copies) {
    record[to].value = selected[from].value;

    if (condition.autoLookup && ['SINGLE_LINE_TEXT', 'NUMBER'].includes(record[to].type)) {
      setTimeout(() => {
        const { record } = getCurrentRecord()!;
        //@ts-ignore
        record[to].lookup = true;
        setCurrentRecord({ record });
      }, 200);
    }
  }

  setCurrentRecord({ record });
  enqueueSnackbar('参照先からデータが取得されました。', { variant: 'success' });
  setLookuped(true);
};

export const clearLookup = (condition: kintone.plugin.Condition) => {
  const { record } = getCurrentRecord()!;

  record[condition.target].value = '';
  for (const { to } of condition.copies) {
    if (Array.isArray(record[to])) {
      record[to].value = [];
    } else {
      record[to].value = '';
    }
  }

  setCurrentRecord({ record });
};
