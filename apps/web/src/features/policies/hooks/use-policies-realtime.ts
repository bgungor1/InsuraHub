'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { policiesSocket } from '@/lib/socket';

export function usePoliciesRealtime() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    policiesSocket.connect();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onInvalidate = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policies.all });
    };

    policiesSocket.on('connect', onConnect);
    policiesSocket.on('disconnect', onDisconnect);
    policiesSocket.on('policy_created', onInvalidate);
    policiesSocket.on('policy_claimed', onInvalidate);
    policiesSocket.on('policy_released', onInvalidate);
    policiesSocket.on('policy_completed', onInvalidate);

    return () => {
      policiesSocket.off('connect', onConnect);
      policiesSocket.off('disconnect', onDisconnect);
      policiesSocket.off('policy_created', onInvalidate);
      policiesSocket.off('policy_claimed', onInvalidate);
      policiesSocket.off('policy_released', onInvalidate);
      policiesSocket.off('policy_completed', onInvalidate);
      policiesSocket.disconnect();
    };
  }, [queryClient]);

  return { isConnected };
}
