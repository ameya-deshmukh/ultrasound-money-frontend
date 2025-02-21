import useSWR from "swr";
import * as Duration from "../duration";
import type { TimeFrameNext } from "../time-frames";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";
import type { EthPrice } from "./grouped-analysis-1";

export const useEthPrice = (): EthPrice | undefined => {
  const { data } = useSWR<EthPrice>(`${feesBasePath}/eth-price`, fetcher, {
    refreshInterval: Duration.millisFromSeconds(8),
  });

  return data;
};

export type AverageEthPrice = Record<TimeFrameNext, number>;

export const useAverageEthPrice = (): AverageEthPrice | undefined => {
  const { data } = useSWR<AverageEthPrice>(
    `${feesBasePath}/average-eth-price`,
    fetcher,
    {
      refreshInterval: Duration.millisFromSeconds(8),
    },
  );

  return data === undefined ? undefined : data;
};
