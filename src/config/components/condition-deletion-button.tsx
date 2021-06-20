import React, { VFC } from 'react';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSetRecoilState } from 'recoil';
import { storageState } from '../states';

type Received = { index: number };

type Props = { onClick: () => void };

const Component: VFC<Props> = ({ onClick }) => (
  <IconButton {...{ onClick }}>
    <DeleteIcon fontSize='small' />
  </IconButton>
);

const Container: VFC<Received> = ({ index }) => {
  const setStorage = useSetRecoilState(storageState);

  const onClick = () => {
    setStorage((_, _storage = _!) => {
      const newCondition = [..._storage.conditions];
      newCondition.splice(index, 1);
      return { ..._storage, conditions: newCondition };
    });
  };

  return <Component {...{ onClick }} />;
};

export default Container;
