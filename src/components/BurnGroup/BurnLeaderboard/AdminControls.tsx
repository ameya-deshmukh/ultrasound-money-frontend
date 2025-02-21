import * as DateFns from "date-fns";
import type { FC } from "react";
import { useAdminToken } from "../../../admin";
import * as Contracts from "../../../api/contracts";

const onSetTwitterHandle = async (
  address: string,
  token: string | undefined,
) => {
  const handle = window.prompt(`input twitter handle`);
  if (handle === null) {
    return;
  }
  await Contracts.setContractTwitterHandle(address, handle, token);
};

const onSetName = async (address: string, token: string | undefined) => {
  const nameInput = window.prompt(`input name`);
  if (nameInput === null) {
    return;
  }
  await Contracts.setContractName(address, nameInput, token);
};

const onSetCategory = async (address: string, token: string | undefined) => {
  const category = window.prompt(`input category`);
  if (category === null) {
    return;
  }
  await Contracts.setContractCategory(address, category, token);
};

const getOpacityFromAge = (dt: Date | undefined) =>
  dt === undefined
    ? 0.8
    : Math.min(
        0.8,
        0.2 + (0.6 / 168) * DateFns.differenceInHours(new Date(), dt),
      );

const AdminControls: FC<{
  address: string;
  freshness: Contracts.MetadataFreshness | undefined;
}> = ({ address, freshness }) => {
  const adminToken = useAdminToken();

  return (
    <>
      <div className="flex flex-row gap-4 opacity-80">
        <a
          className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
          onClick={() => {
            onSetTwitterHandle(address, adminToken).catch(console.error);
          }}
          target="_blank"
          rel="noreferrer"
        >
          set handle
        </a>
        <a
          className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
          onClick={() => {
            onSetName(address, adminToken).catch(console.error);
          }}
          target="_blank"
          rel="noreferrer"
        >
          set name
        </a>
        <a
          className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
          onClick={() => {
            onSetCategory(address, adminToken).catch(console.error);
          }}
          target="_blank"
          rel="noreferrer"
        >
          set category
        </a>
        <a
          className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
          onClick={() => {
            Contracts.setContractLastManuallyVerified(
              address,
              adminToken,
            ).catch(console.error);
          }}
          target="_blank"
          rel="noreferrer"
        >
          set verified
        </a>
      </div>
      <div className="flex text-sm text-white gap-x-4 mt-2">
        <span
          className="bg-slate-700 rounded-lg py-1 px-2"
          style={{
            opacity: getOpacityFromAge(freshness?.openseaContractLastFetch),
          }}
        >
          {freshness?.openseaContractLastFetch === undefined
            ? "never fetched"
            : `opensea fetch ${DateFns.formatDistanceToNowStrict(
                freshness.openseaContractLastFetch,
              )} ago`}
        </span>
        <span
          className="bg-slate-700 rounded-lg py-1 px-2"
          style={{
            opacity: getOpacityFromAge(freshness?.lastManuallyVerified),
          }}
        >
          {freshness?.lastManuallyVerified === undefined
            ? "never verified"
            : `last verified ${DateFns.formatDistanceToNowStrict(
                freshness.lastManuallyVerified,
              )} ago`}
        </span>
      </div>
    </>
  );
};

export default AdminControls;
