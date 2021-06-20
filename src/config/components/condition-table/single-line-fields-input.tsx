import React, { VFC, VFCX } from 'react';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { Properties } from '@kintone/rest-api-client/lib/client/types';
import { CircularProgress, TextField, MenuItem, TextFieldProps } from '@material-ui/core';

import { singleLineFieldsState } from '../../states';

type ContainerProps = TextFieldProps;

type Props = ContainerProps & {
  fields: Partial<Properties> | null;
};

const Component: VFCX<Props> = ({ className, fields, ...others }) => (
  <>
    {!fields && <CircularProgress />}
    {!!fields && (
      <TextField {...others} select>
        {Object.values(fields).map(
          (fields, i) =>
            !!fields && (
              <MenuItem key={i} value={fields.code}>
                {fields.label}
              </MenuItem>
            )
        )}
      </TextField>
    )}
  </>
);

const StyledComponent = styled(Component)``;

const Container: VFC<ContainerProps> = (props) => {
  const fields = useRecoilValue(singleLineFieldsState);

  return <StyledComponent {...{ ...props, fields }} />;
};

export default Container;
