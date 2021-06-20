import React, { VFC } from 'react';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import { LookupButton, Dialog } from './components';
import { pluginConditionState } from './states';

type Props = { condition: kintone.plugin.Condition };

const Component: VFC<Props> = ({ condition }) => (
  <RecoilRoot
    initializeState={({ set }) => {
      set(pluginConditionState, condition);
    }}
  >
    <SnackbarProvider maxSnack={3}>
      <LookupButton />
      <Dialog />
    </SnackbarProvider>
  </RecoilRoot>
);

export default Component;
