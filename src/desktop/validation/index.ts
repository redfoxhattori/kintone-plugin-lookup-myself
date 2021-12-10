import { getAppId } from '@common/kintone';
import { cleanseStorage, restoreStorage } from '@common/plugin';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';

const events: launcher.EventTypes = ['app.record.create.submit', 'app.record.edit.submit'];

const action: launcher.Action = async (event, pluginId) => {
  const { conditions } = cleanseStorage(restoreStorage(pluginId));

  const targetConditions = conditions.filter(
    (condition) => condition.target && condition.related && condition.enablesValidation
  );

  if (!targetConditions.length) {
    return event;
  }

  const client = new KintoneRestAPIClient();

  for (const condition of targetConditions) {
    if (!event.record[condition.target] || !event.record[condition.target].value) {
      continue;
    }
    const app = getAppId()!;
    const value = event.record[condition.target].value;
    const query = `${condition.related} = "${value}"`;

    const { records } = await client.record.getRecords({ app, query });

    if (!records.length) {
      event.record[condition.target].error = '[取得]を押し、参照先からデータを取得してください。';
      event.error = 'ルックアップが完了していないフィールドが存在します';
    }
  }

  return event;
};

export default { action, events };
