import JSBI from "jsbi";
import dropRight from "lodash/dropRight";
import flow from "lodash/flow";
import takeRight from "lodash/takeRight";
import type { FC } from "react";
import { useCallback } from "react";
import CountUp from "react-countup";
import { AmountAnimatedShell, defaultMoneyAnimationDuration } from "../Amount";

// For a wei number 119,144,277,858,326,743,920,488,300 we want to display the
// full number, and animate it. For display we could use strings, but for
// animation we need numbers. Numbers are sufficiently large where we run
// against low level limits (IEEE 754), and can't work with the full number. We
// split the number into three parts, to enable both precision and animation.

const ethNoDecimals = flow(
  (ethSupplySum: JSBI) => ethSupplySum.toString().split(""),
  (chars) => dropRight(chars, 18),
  (str) => str.join(""),
  (str) => JSBI.BigInt(str),
  (num) => JSBI.toNumber(num),
);

// The last six digits in the number.
const ethLastSixteenDecimals = flow(
  (ethSupplySum: JSBI) => ethSupplySum.toString().split(""),
  (chars) => takeRight(chars, 16),
  (str) => str.join(""),
  (str) => JSBI.BigInt(str),
  (num) => JSBI.toNumber(num),
);

// Everything that is left from the fractional part when written in ETH instead of Wei. This is always twelve digits.
const ethFirstTwoDecimals = flow(
  (ethSupplySum: JSBI) => ethSupplySum.toString().split(""),
  (chars) => dropRight(chars, 16),
  (chars) => takeRight(chars, 2),
  (str) => str.join(""),
  (str) => JSBI.BigInt(str),
  (num) => JSBI.toNumber(num),
);

const formatDecimals = (num: number, padTo: number): string => {
  const numsAsStrings = num.toString().padStart(padTo, "0").split("").reverse();
  const result = [];
  for (let i = 0; i < numsAsStrings.length; i++) {
    if (i !== 0 && i % 3 === 0) {
      result.push(",");
    }

    result.push(numsAsStrings[i]);
  }
  return result.reverse().join("");
};

const Digits: FC<{ children: JSBI }> = ({ children }) => {
  const padTwoDecimals = useCallback(
    (num: number) => formatDecimals(num, 2),
    [],
  );

  const padSixteenDecimals = useCallback(
    (num: number) => formatDecimals(num, 16),
    [],
  );

  return (
    <div className="relative w-[26px] [@media(min-width:375px)]:w-9 -mr-1">
      <div
        // We need whitespace-normal to counteract the whitespace-nowrap from our parent.
        className={`
          text-[6px] [@media(min-width:375px)]:text-[8px]
          leading-[0.4rem] [@media(min-width:375px)]:leading-[0.5rem]
          text-white
          block break-all
          whitespace-normal
          absolute
          overflow-hidden
          w-3 h-2
        `}
      >
        {ethFirstTwoDecimals(children) === 0 ? (
          <span>00</span>
        ) : (
          <CountUp
            separator=","
            end={ethFirstTwoDecimals(children)}
            formattingFn={padTwoDecimals}
            preserveValue={true}
            useEasing={false}
            duration={0.5}
          />
        )}
      </div>
      <div
        // We need whitespace-normal to counteract the whitespace-nowrap from our parent.
        className={`
          text-[6px] [@media(min-width:375px)]:text-[8px]
          leading-[0.4rem] [@media(min-width:375px)]:leading-[0.5rem]
          text-blue-spindle
          block break-all
          whitespace-normal
          left-0
        `}
      >
        &nbsp;&nbsp;
        {ethLastSixteenDecimals(children) === 0 ? (
          <span>0,000,000,000,000,000</span>
        ) : (
          <CountUp
            separator=","
            end={ethLastSixteenDecimals(children)}
            formattingFn={padSixteenDecimals}
            preserveValue={true}
            useEasing={false}
          />
        )}
      </div>
    </div>
  );
};

const PreciseEth: FC<{ children?: JSBI; justify?: "justify-end" }> = ({
  children,
  justify,
}) => (
  <AmountAnimatedShell
    className={`
      flex items-center
      ${justify !== undefined ? justify : ""}
      tracking-tight
    `}
    textClassName="text-[1.30rem] [@media(min-width:375px)]:text-[1.70rem]"
    skeletonWidth={"3rem"}
    unitText={"ETH"}
  >
    {children && (
      <>
        <CountUp
          decimals={0}
          duration={defaultMoneyAnimationDuration}
          end={ethNoDecimals(children)}
          preserveValue={true}
          separator=","
        />
        .<Digits>{children}</Digits>
      </>
    )}
  </AmountAnimatedShell>
);

export default PreciseEth;
