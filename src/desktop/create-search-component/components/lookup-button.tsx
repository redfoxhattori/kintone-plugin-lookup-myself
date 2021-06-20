import React, { useState, VFC, VFCX } from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress } from '@material-ui/core';

import { clearLookup, lookup } from '../action';
import { useSnackbar } from 'notistack';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import {
  dialogPageIndexState,
  dialogTitleState,
  dialogVisibleState,
  lookupRecordsState,
  pluginConditionState,
  searchInputState,
} from '../states';

type Props = {
  onClickRefer: () => void;
  onClickClear: () => void;
  loading: boolean;
};

const Component: VFCX<Props> = ({ className, onClickRefer, onClickClear, loading }) => (
  <div {...{ className }}>
    <div>
      <Button color='primary' onClick={onClickRefer} disabled={loading}>
        取得
      </Button>
      {loading && <CircularProgress className='circle' size={24} />}
    </div>
    <Button color='primary' onClick={onClickClear} disabled={loading}>
      クリア
    </Button>
  </div>
);

const StyledComponent = styled(Component)`
  display: flex;
  & > div {
    position: relative;

    & > .circle {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -12px 0 0 -12px;
    }
  }
`;

const Container: VFC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const setShown = useSetRecoilState(dialogVisibleState);
  const setRecords = useSetRecoilState(lookupRecordsState);
  const setInput = useSetRecoilState(searchInputState);
  const setPageIndex = useSetRecoilState(dialogPageIndexState);
  const setTitle = useSetRecoilState(dialogTitleState);
  const [loading, setLoading] = useState(false);

  const onClickRefer = useRecoilCallback(({ snapshot }) => async () => {
    setLoading(true);
    setPageIndex(1);
    setInput('');
    const condition = await snapshot.getPromise(pluginConditionState);

    try {
      await lookup(enqueueSnackbar, setShown, setRecords, condition!);
    } catch (error) {
      enqueueSnackbar('ルックアップ時にエラーが発生しました', { variant: 'error' });
      throw error;
    } finally {
      setLoading(false);
    }
  });

  const onClickClear = useRecoilCallback(({ snapshot }) => async () => {
    const condition = await snapshot.getPromise(pluginConditionState);
    clearLookup(condition!);
    enqueueSnackbar('参照先フィールドをクリアしました', { variant: 'success' });
  });

  return <StyledComponent {...{ onClickRefer, onClickClear, loading }} />;
};

export default Container;
