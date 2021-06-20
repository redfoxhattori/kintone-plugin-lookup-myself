export const isMobile = (eventType?: string) => {
  if (eventType) {
    return eventType.includes('mobile.');
  }
  return cybozu?.data?.IS_MOBILE_DEVICE ?? !kintone.app.getId();
};

export const getApp = (eventType?: string): typeof kintone.mobile.app | typeof kintone.app =>
  isMobile(eventType) ? kintone.mobile.app : kintone.app;

export const getAppId = () => getApp().getId();
export const getRecordId = () => getApp().record.getId();
export const getQuery = () => getApp().getQuery();
export const getQueryCondition = () => getApp().getQueryCondition();

export const getCurrentRecord = () => getApp().record.get();
export const setCurrentRecord = (record: { record: any }) => getApp().record.set(record);

export const setFieldShown = <T = any>(code: keyof T, visible: boolean) =>
  getApp().record.setFieldShown(String(code), visible);

export const getChangeEvents = <T>(
  events: ('create' | 'edit' | 'index.edit')[],
  fields: (keyof T)[]
) =>
  events.reduce<kintone.EventType[]>(
    (acc, event) =>
      [
        acc,
        fields.map((field) => `app.record.${event}.change.${field}`),
      ].flat() as kintone.EventType[],
    []
  );

export const getHeaderSpace = (eventType: string) => {
  if (isMobile(eventType)) {
    kintone.mobile.app.getHeaderSpaceElement();
  } else if (!~eventType.indexOf('index')) {
    return kintone.app.record.getHeaderMenuSpaceElement();
  }
  return kintone.app.getHeaderMenuSpaceElement();
};
