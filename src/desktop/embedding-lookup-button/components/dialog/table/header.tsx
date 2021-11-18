import React, { Suspense, VFC } from 'react';
import { useRecoilValue } from 'recoil';
import { pluginConditionState } from '../../../states';
import { fieldPropertiesState } from '../../../states/field-properties';

type Props = Readonly<{ condition: kintone.plugin.Condition }>;

const Component: VFC<Props> = ({ condition }) => {
  const properties = useRecoilValue(fieldPropertiesState);

  const cells = [condition.related, ...condition.sees].map((fieldCode, i) => {
    const found = properties.find(({ code }) => fieldCode === code);
    return found ? found.label : fieldCode;
  });

  return (
    <>
      {cells.map((code, i) => (
        <th key={i}>{code}</th>
      ))}
    </>
  );
};

const Container: VFC = () => {
  const condition = useRecoilValue(pluginConditionState);

  if (!condition) {
    return null;
  }

  return (
    <thead>
      <tr>
        <Suspense
          fallback={[condition.related, ...condition.sees].map((code, i) => (
            <th key={i}>{code}</th>
          ))}
        >
          <Component {...{ condition }} />
        </Suspense>
      </tr>
    </thead>
  );
};

export default Container;
