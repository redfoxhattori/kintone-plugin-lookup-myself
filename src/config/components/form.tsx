import React, { FC, useEffect, VFCX } from 'react';
import styled from '@emotion/styled';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { appFieldsState, storageState } from '../states';
import { CircularProgress } from '@material-ui/core';
import { ConditionAdditionButton, ConditionTable } from '.';
import { getFilterdFields } from '../actions';

type Props = {
  storage: kintone.plugin.Storage | null;
};

const Component: VFCX<Props> = ({ className, storage }) => (
  <div {...{ className }}>
    {!storage && (
      <div className='loading'>
        <CircularProgress />
        <div>設定情報を取得しています</div>
      </div>
    )}
    {!!storage && (
      <>
        <ConditionTable />
        <ConditionAdditionButton label='新しいルックアップ設定' />
      </>
    )}
  </div>
);

const StyledComponent = styled(Component)`
  & > .loading {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > div {
      padding: 1em;
    }
  }
`;

const Container: FC = () => {
  const storage = useRecoilValue(storageState);
  const setAppFields = useSetRecoilState(appFieldsState);

  useEffect(() => {
    (async () => {
      setAppFields(await getFilterdFields());
    })();
  }, []);

  return <StyledComponent {...{ storage }} />;
};

export default Container;
