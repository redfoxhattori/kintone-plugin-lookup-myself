import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { Properties } from '@kintone/rest-api-client/lib/client/types';
import { OneOf } from '@kintone/rest-api-client/lib/KintoneFields/types/property';

/** kintoneアプリに初期状態で存在するフィールドタイプ */
const DEFAULT_DEFINED_FIELDS: PickType<OneOf, 'type'>[] = [
  'UPDATED_TIME',
  'CREATOR',
  'CREATED_TIME',
  'CATEGORY',
  'MODIFIER',
  'STATUS',
];

/** プラグインで使用しないフィールドタイプ */
const UNUSE_FIELDS: PickType<OneOf, 'type'>[] = ['GROUP', 'SUBTABLE', 'REFERENCE_TABLE'];

export const getAppFields = async (targetApp?: string) => {
  const app = targetApp || kintone.app.getId();

  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const client = new KintoneRestAPIClient();

  const { properties } = await client.app.getFormFields({ app });

  console.log({ properties });

  return properties;
};

export const getUserDefinedFields = async (): Promise<Properties> => {
  const fields = await getAppFields();

  const filterd = Object.entries(fields).filter(
    ([_, value]) => !DEFAULT_DEFINED_FIELDS.includes(value.type)
  );

  return filterd.reduce<Properties>((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

export const getFilterdFields = async (): Promise<Properties> => {
  const fields = await getUserDefinedFields();

  const filterd = Object.entries(fields).filter(([_, value]) => !UNUSE_FIELDS.includes(value.type));

  return filterd.reduce<Properties>((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};
