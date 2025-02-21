import flow from "lodash/flow";
import type { FC } from "react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import {
  getPercentOfTotal,
  useIssuanceBreakdown,
} from "../api/issuance-breakdown";
import Colors from "../colors";
import * as Format from "../format";
import { MoneyAmount } from "./Amount";
import { BodyText, LabelText, TextRoboto } from "./Texts";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

const skeletonLoadingWidth = 0.1;

type CategorySegmentProps = {
  imgAlt: string;
  imgName: string;
  onHoverCategory: (hovering: boolean) => void;
  percentOfTotalRewards: number | undefined;
  rounded?: "left" | "right";
  showHighlight: boolean;
};

const CategorySegment: FC<CategorySegmentProps> = ({
  imgAlt,
  imgName,
  onHoverCategory,
  percentOfTotalRewards,
  rounded,
  showHighlight,
}) => (
  <div
    className="flex flex-col items-center select-none"
    style={{
      width: `${(percentOfTotalRewards ?? skeletonLoadingWidth) * 100}%`,
    }}
    onMouseEnter={() => onHoverCategory(true)}
    onMouseLeave={() => onHoverCategory(false)}
  >
    {imgName === undefined ? (
      <Skeleton height="16px" width="1.4rem" className="mb-3" />
    ) : (
      <>
        <img
          className="relative w-6"
          src={`/${imgName}-coloroff.svg`}
          alt={imgAlt}
          style={{
            height: "21px",
            marginBottom: "12px",
            visibility:
              typeof percentOfTotalRewards === "number" &&
              percentOfTotalRewards < 0.08
                ? "hidden"
                : "visible",
          }}
        />
        <img
          className="absolute w-6"
          src={`/${imgName}-coloron.svg`}
          alt="colored ice crystal, signifying staked ETH"
          style={{
            height: "21px",
            marginBottom: "12px",
            visibility: showHighlight ? "visible" : "hidden",
          }}
        />
      </>
    )}
    <div
      className={`h-2 bg-blue-spindle w-full color-animation ${
        rounded === "left"
          ? "rounded-l-full"
          : rounded === "right"
          ? "rounded-r-full"
          : ""
      }`}
      style={{
        backgroundColor: showHighlight ? Colors.white : Colors.spindle,
      }}
    ></div>
    <div
      style={{
        marginTop: "9px",
        visibility:
          (typeof percentOfTotalRewards === "number" &&
            percentOfTotalRewards >= 0.08) ||
          showHighlight
            ? "visible"
            : "hidden",
      }}
    >
      {percentOfTotalRewards ? (
        <TextRoboto
          className="color-animation"
          style={{
            color: showHighlight ? Colors.white : Colors.spindle,
          }}
        >
          {Format.formatPercentNoDecimals(percentOfTotalRewards)}
        </TextRoboto>
      ) : (
        <Skeleton width="1.5rem" />
      )}
    </div>
  </div>
);

type IssuanceRowProps = {
  amount: number | undefined;
  hovering: boolean;
  link?: string;
  name: string;
  setHovering?: (bool: boolean) => void;
};

const millionEthFromGwei = flow(
  Format.ethFromGwei,
  // in M of ETH.
  (eth) => eth / 1_000_000,
  Format.formatOneDecimal,
  (numberStr) => `${numberStr}M`,
);

const IssuanceRow: FC<IssuanceRowProps> = ({
  amount,
  hovering,
  link,
  name,
  setHovering,
}) => (
  <a
    className="grid grid-cols-2 link-animation"
    onMouseEnter={() => setHovering?.(true)}
    onMouseLeave={() => setHovering?.(false)}
    style={{ opacity: hovering ? 0.6 : 1 }}
    href={link}
    target="_blank"
    rel="noreferrer"
  >
    <BodyText>{name}</BodyText>
    <MoneyAmount className="font-light text-right">
      {typeof amount === "number" ? millionEthFromGwei(amount) : undefined}
    </MoneyAmount>
  </a>
);

const IssuanceBreakdown = () => {
  const [highlightCrowdSale, setHighlightCrowdSale] = useState(false);
  const [highlightProofOfWork, setHighlightProofOfWork] = useState(false);
  const [highlightEthereumFoundation, setHighlightEthereumFoundation] =
    useState(false);
  const [highlightEarlyContributors, setHighlightEarlyContributors] =
    useState(false);
  const [highlightProofOfStake, setHighlightProofOfStake] = useState(false);

  const issuanceBreakdown = useIssuanceBreakdown();

  return (
    <WidgetBackground>
      <WidgetTitle>issuance breakdown</WidgetTitle>
      {issuanceBreakdown === undefined ? (
        <div className="relative py-16">
          <div className="absolute w-full h-2 bg-blue-dusk rounded-full"></div>
        </div>
      ) : (
        <div className="relative flex py-4 items-center">
          <div className="absolute w-full h-2 bg-blue-highlightbg rounded-full color-animation"></div>
          <div className="w-full flex flex-row top-0 left-0 items-center z-10">
            <CategorySegment
              imgAlt={"btc symbol symbolizing the bitcoin crowd sale"}
              imgName={"btc"}
              onHoverCategory={setHighlightCrowdSale}
              percentOfTotalRewards={getPercentOfTotal(
                issuanceBreakdown,
                "crowdSale",
              )}
              rounded="left"
              showHighlight={highlightCrowdSale}
            />
            <div className="h-2 bg-blue-dusk w-0.5"></div>
            <CategorySegment
              imgAlt={
                "a pickaxe symbolizing the ETH minted using proof of work"
              }
              imgName={"pick"}
              onHoverCategory={setHighlightProofOfWork}
              percentOfTotalRewards={getPercentOfTotal(
                issuanceBreakdown,
                "proofOfWork",
              )}
              showHighlight={highlightProofOfWork}
            />
            <div className="h-2 bg-blue-dusk w-0.5"></div>
            <CategorySegment
              imgAlt={
                "a seedling symbolizing the gardening Ethereum Foundation"
              }
              imgName={"seedling"}
              onHoverCategory={setHighlightEthereumFoundation}
              percentOfTotalRewards={getPercentOfTotal(
                issuanceBreakdown,
                "ethereumFoundation",
              )}
              showHighlight={highlightEthereumFoundation}
            />
            <div className="h-2 bg-blue-dusk w-0.5"></div>
            <CategorySegment
              imgAlt={
                "a unicorn symbolizing the early contributors dreaming up and building Ethereum"
              }
              imgName={"unicorn"}
              onHoverCategory={setHighlightEarlyContributors}
              percentOfTotalRewards={getPercentOfTotal(
                issuanceBreakdown,
                "earlyContributors",
              )}
              showHighlight={highlightEarlyContributors}
            />
            <div className="h-2 bg-blue-dusk w-0.5"></div>
            <CategorySegment
              imgAlt={
                "a steak as workplay on stake, symbolizing the ETH minted using proof of stake"
              }
              imgName={"steak"}
              onHoverCategory={setHighlightProofOfStake}
              percentOfTotalRewards={getPercentOfTotal(
                issuanceBreakdown,
                "proofOfStake",
              )}
              rounded="right"
              showHighlight={highlightProofOfStake}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-3">
        <div className="grid grid-cols-2">
          <LabelText>category</LabelText>
          <LabelText className="text-right">amount</LabelText>
        </div>
        <IssuanceRow
          amount={issuanceBreakdown?.crowdSale}
          hovering={highlightCrowdSale}
          name="Bitcoin crowd sale"
          setHovering={setHighlightCrowdSale}
        />
        <IssuanceRow
          amount={issuanceBreakdown?.proofOfWork}
          hovering={highlightProofOfWork}
          name="proof of work"
          setHovering={setHighlightProofOfWork}
        />
        <IssuanceRow
          amount={issuanceBreakdown?.ethereumFoundation}
          hovering={highlightEthereumFoundation}
          name="Ethereum Foundation"
          setHovering={setHighlightEthereumFoundation}
        />
        <IssuanceRow
          amount={issuanceBreakdown?.earlyContributors}
          hovering={highlightEarlyContributors}
          name="early contributors"
          setHovering={setHighlightEarlyContributors}
        />
        <IssuanceRow
          amount={issuanceBreakdown?.proofOfStake}
          hovering={highlightProofOfStake}
          name="proof of stake"
          setHovering={setHighlightProofOfStake}
        />
      </div>
    </WidgetBackground>
  );
};

export default IssuanceBreakdown;
