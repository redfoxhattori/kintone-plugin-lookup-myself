import React, { VFC, VFCX } from 'react';
import styled from '@emotion/styled';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { useRecoilState } from 'recoil';
import { storageState } from '../../states';
import { ConditionDeletionButton } from '..';

import ConditionForm from './condition-form';

type Props = {
  storage: kintone.plugin.Storage | null;
  expanded: number | false;
  onChange: (index: number) => (_: any, isExpanded: boolean) => void;
};

const Component: VFCX<Props> = ({ className, storage, expanded, onChange }) => (
  <div {...{ className }}>
    {!!storage &&
      storage.conditions.map((condition, index) => (
        <Accordion key={index} expanded={expanded === index} onChange={onChange(index)}>
          <AccordionSummary>
            ルックアップ設定{condition.target ? `　(${condition.target})` : ''}
          </AccordionSummary>
          <AccordionDetails>
            <ConditionForm {...{ condition, index }} />
          </AccordionDetails>
          <AccordionActions>
            <ConditionDeletionButton {...{ index }} />
          </AccordionActions>
        </Accordion>
      ))}
  </div>
);

const StyledComponent = styled(Component)`
  width: 100%;
  & > div {
    box-shadow: none;
    border: 1px solid #0033;
    border-radius: 4px;
    margin-bottom: -1px;

    .input {
      min-width: 250px;
    }
  }
`;

const Container: VFC = () => {
  const [storage, setStorage] = useRecoilState(storageState);
  const [expanded, setExpanded] = React.useState<number | false>(0);

  const onChange = (index: number) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? index : false);
  };

  console.log({ storage });

  return <StyledComponent {...{ storage, expanded, onChange }} />;
};

export default Container;
