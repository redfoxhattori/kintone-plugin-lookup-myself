import React, { VFC } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useSetRecoilState } from 'recoil';
import { storageState } from '../states';
import { getNewCondition } from '@common/plugin';

type Received = { label: string };

type Props = Received & { addCondition: () => void };

const Component: VFC<Props> = ({ addCondition, label }) => (
  <Button
    variant='outlined'
    color='primary'
    size='small'
    startIcon={<AddIcon />}
    onClick={addCondition}
    style={{ marginTop: '16px' }}
  >
    {label}
  </Button>
);

const Container: VFC<Received> = ({ label }) => {
  const setStorage = useSetRecoilState(storageState);

  const addCondition = () => {
    setStorage((_, _storage = _!) => ({
      ..._storage,
      conditions: [..._storage.conditions, getNewCondition()],
    }));
  };

  return <Component {...{ label, addCondition }} />;
};

export default Container;
