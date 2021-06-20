import React, { VFC, VFCX } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import { Properties } from '@kintone/rest-api-client/lib/client/types';
import { CircularProgress, IconButton, Tooltip } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { appFieldsState, storageState } from '../../states';

import AppFieldsInput from './app-fields-input';
import SingleLineSelect from './single-line-fields-input';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };

type Props = ContainerProps & {
  fields: Properties | null;
  onTargetChange: (value: string) => void;
  onRelatedChange: (value: string) => void;
  onCopyFromChange: (rowIndex: number, value: string) => void;
  onCopyToChange: (rowIndex: number, value: string) => void;
  addCopies: (rowIndex: number) => void;
  removeCopies: (rowIndex: number) => void;
  onDisplayFieldChange: (rowIndex: number, value: string) => void;
  addSees: (rowIndex: number) => void;
  removeSees: (rowIndex: number) => void;
};

const Component: VFCX<Props> = ({
  className,
  condition,
  fields,
  onTargetChange,
  onRelatedChange,
  onCopyFromChange,
  onCopyToChange,
  addCopies,
  removeCopies,
  onDisplayFieldChange,
  addSees,
  removeSees,
}) => (
  <>
    {!fields && <CircularProgress />}
    {!!fields && (
      <div {...{ className }}>
        <div>
          <h3 style={{ marginTop: '0' }}>ルックアップボタンを設置するフィールド</h3>
          <div>
            <SingleLineSelect
              label='対象フィールド'
              value={condition.target}
              onChange={(e) => onTargetChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3>関連付けるフィールド(ボタンを設置したフィールドに反映するフィールド)</h3>
          <div>
            <SingleLineSelect
              label='対象フィールド'
              value={condition.related}
              onChange={(e) => onRelatedChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3>他のフィールドのコピー</h3>

          {condition.copies.map(({ from, to }, i) => (
            <div key={i} className='row'>
              <AppFieldsInput
                label='コピー元'
                value={from}
                onChange={(e) => onCopyFromChange(i, e.target.value)}
              />
              <ArrowForwardIcon />
              <AppFieldsInput
                label='コピー先'
                value={to}
                onChange={(e) => onCopyToChange(i, e.target.value)}
              />
              <Tooltip title='コピー設定を追加する'>
                <IconButton size='small' onClick={() => addCopies(i)}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              {condition.copies.length > 1 && (
                <Tooltip title='このコピー設定を削除する'>
                  <IconButton size='small' onClick={() => removeCopies(i)}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
        <div>
          <h3>コピー元のレコードの選択時に表示するフィールド</h3>
          {condition.sees.map((field, i) => (
            <div key={i} className='row'>
              <AppFieldsInput
                label='表示するフィールド'
                value={field}
                onChange={(e) => onDisplayFieldChange(i, e.target.value)}
              />

              <Tooltip title='表示フィールドを追加する'>
                <IconButton size='small' onClick={() => addSees(i)}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              {condition.sees.length > 1 && (
                <Tooltip title='この表示フィールドを削除する'>
                  <IconButton size='small' onClick={() => removeSees(i)}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </>
);

const StyledComponent = styled(Component)`
  padding: 0 16px;

  > div {
    border-left: 5px solid #3f51b566;
    > *:not(h3) {
      padding-left: 16px;
    }
    padding: 4px 0;

    &:not(:last-of-type) {
      margin-bottom: 32px;
    }
  }

  h3 {
    font-weight: 500;
    margin: 0 0 12px;
    padding-left: 12px;
  }

  .MuiTextField-root {
    min-width: 200px;
  }

  .row {
    display: flex;
    align-items: center;

    &:not(:last-of-type) {
      margin-bottom: 8px;
    }

    > *:not(button) {
      margin: 0 8px;
    }
    > button {
      margin-right: 8px;
    }

    > svg {
      fill: #999;
    }
  }
`;

const Container: VFC<ContainerProps> = ({ condition, index }) => {
  const setStorage = useSetRecoilState(storageState);
  const fields = useRecoilValue(appFieldsState);

  console.log('form.tsx', { fields });

  const onTargetChange = (value: string) => {
    setStorage((_storage) => {
      if (!_storage) {
        return _storage;
      }

      const newCondition = [..._storage.conditions];

      newCondition[index] = { ...newCondition[index], target: value };

      return { ..._storage, conditions: newCondition };
    });
  };

  const onRelatedChange = (value: string) => {
    setStorage((_storage) => {
      if (!_storage) {
        return _storage;
      }

      const newCondition = [..._storage.conditions];

      newCondition[index] = { ...newCondition[index], related: value };

      return { ..._storage, conditions: newCondition };
    });
  };

  const onCopyFromChange = (rowIndex: number, value: string) => {
    setStorage((_storage) => {
      if (!_storage) {
        return _storage;
      }

      const newCondition = [..._storage.conditions];

      const newCopies = [...newCondition[index].copies];

      newCopies[rowIndex] = { ...newCopies[rowIndex], from: value };

      newCondition[index] = {
        ...newCondition[index],
        copies: newCopies,
      };

      return { ..._storage, conditions: newCondition };
    });
  };

  const onCopyToChange = (rowIndex: number, value: string) => {
    setStorage((_storage) => {
      if (!_storage) {
        return _storage;
      }

      const newCondition = [..._storage.conditions];

      const newCopies = [...newCondition[index].copies];

      newCopies[rowIndex] = { ...newCopies[rowIndex], to: value };

      newCondition[index] = {
        ...newCondition[index],
        copies: newCopies,
      };

      return { ..._storage, conditions: newCondition };
    });
  };

  const onDisplayFieldChange = (rowIndex: number, value: string) => {
    setStorage((_storage) => {
      if (!_storage) {
        return _storage;
      }

      const newCondition = [..._storage.conditions];

      const newSees = [...newCondition[index].sees];

      newSees[rowIndex] = value;

      newCondition[index] = {
        ...newCondition[index],
        sees: newSees,
      };

      return { ..._storage, conditions: newCondition };
    });
  };

  const addCopies = (rowIndex: number) => {
    setStorage((_storage) => {
      if (!_storage) {
        return _storage;
      }

      const newCondition = [..._storage.conditions];

      const newCopies = [...newCondition[index].copies];

      newCopies.splice(rowIndex + 1, 0, { from: '', to: '' });

      newCondition[index] = {
        ...newCondition[index],
        copies: newCopies,
      };

      return { ..._storage, conditions: newCondition };
    });
  };

  const removeCopies = (rowIndex: number) => {
    setStorage((_storage) => {
      if (!_storage) {
        return _storage;
      }

      const newCondition = [..._storage.conditions];

      const newCopies = [...newCondition[index].copies];

      newCopies.splice(rowIndex, 1);

      newCondition[index] = {
        ...newCondition[index],
        copies: newCopies,
      };

      return { ..._storage, conditions: newCondition };
    });
  };

  const addSees = (rowIndex: number) => {
    setStorage((_storage) => {
      if (!_storage) {
        return _storage;
      }

      const newCondition = [..._storage.conditions];

      const newSees = [...newCondition[index].sees];

      newSees.splice(rowIndex + 1, 0, '');

      newCondition[index] = {
        ...newCondition[index],
        sees: newSees,
      };

      return { ..._storage, conditions: newCondition };
    });
  };

  const removeSees = (rowIndex: number) => {
    setStorage((_storage) => {
      if (!_storage) {
        return _storage;
      }

      const newCondition = [..._storage.conditions];

      const newSees = [...newCondition[index].sees];

      newSees.splice(rowIndex, 1);

      newCondition[index] = {
        ...newCondition[index],
        sees: newSees,
      };

      return { ..._storage, conditions: newCondition };
    });
  };

  return (
    <StyledComponent
      {...{
        condition,
        index,
        fields,
        onTargetChange,
        onRelatedChange,
        onCopyFromChange,
        onCopyToChange,
        addCopies,
        removeCopies,
        onDisplayFieldChange,
        addSees,
        removeSees,
      }}
    />
  );
};

export default Container;
