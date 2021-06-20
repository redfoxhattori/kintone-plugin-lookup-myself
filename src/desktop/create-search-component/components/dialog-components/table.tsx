import React, { VFC, VFCX } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';

import {
  filterdRecordsState,
  dialogPageChunkState,
  dialogPageIndexState,
  dialogVisibleState,
  pluginConditionState,
} from '../../states';
import { apply } from '../../action';
import { useSnackbar } from 'notistack';

type Props = {
  records: any[];
  onRowClick: (record: any) => void;
  condition: kintone.plugin.Condition | null;
};

const Component: VFCX<Props> = ({ className, records, onRowClick, condition }) => (
  <div {...{ className }}>
    {!records.length && (
      <div className='not-found'>
        <img src='' />
        <div>条件に一致するデータが見つかりませんでした。</div>
      </div>
    )}
    {!!records.length && (
      <table>
        <thead>
          <tr>
            <th>{condition?.related}</th>
            {!!condition && condition.sees.map((code, i) => <th key={i}>{code}</th>)}
          </tr>
        </thead>
        <tbody>
          {!!condition &&
            records.map((record, i) => (
              <tr key={i} onClick={() => onRowClick(record)}>
                <td>{record[condition.related].value}</td>
                {condition.sees.map((code, j) => (
                  <td key={j}>{record[code].value}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </div>
);

const StyledComponent = styled(Component)`
  & > .not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 1.5em;
    color: #aaa;

    & > img {
      width: 200px;
      opacity: 0.2;
    }

    & > div {
      line-height: 3em;
    }
  }

  table {
    width: 100%;
    padding: 0 16px 16px;
    white-space: nowrap;
    background-color: #fff;
    font-size: 88%;
    @media screen {
      border-collapse: separate;
    }
    @media print {
      font-size: 100%;
    }

    th {
      font-weight: 400;
    }

    th,
    td {
      border-right: 1px solid #ddd;
      padding: 8px 15px;

      &:first-of-type {
        border-left: 1px solid #ddd;
      }
    }

    thead {
      tr {
        th {
          background-color: #c9e4f5;
          padding: 10px 15px;
          @media screen {
            position: sticky;
            top: 60px;
            z-index: 1;
          }
        }
      }
    }

    tbody {
      tr {
        line-height: 30px;
        cursor: pointer;

        td {
          background-color: #fff;
        }

        &:nth-of-type(2n) {
          td {
            background-color: #eef4f9;
          }
        }

        &:last-of-type {
          td {
            border-bottom: 1px solid #ddd;
          }
        }

        &:hover {
          td {
            filter: brightness(0.95);
          }
        }
      }
    }
  }
`;

const Container: VFC = () => {
  const condition = useRecoilValue(pluginConditionState);
  const filterd = useRecoilValue(filterdRecordsState);
  const index = useRecoilValue(dialogPageIndexState);
  const chunk = useRecoilValue(dialogPageChunkState);
  const setDialogShown = useSetRecoilState(dialogVisibleState);
  const { enqueueSnackbar } = useSnackbar();

  const records = filterd.slice((index - 1) * chunk, index * chunk);

  const onRowClick = (record: any) => {
    apply(record, condition!);
    setDialogShown(false);
    enqueueSnackbar('参照先からデータが取得されました。', { variant: 'success' });
  };

  return <StyledComponent {...{ records, onRowClick, condition }} />;
};

export default Container;
