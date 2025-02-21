import clamp from "lodash/clamp";
import type { FC } from "react";
import { useState } from "react";
import CountUp from "react-countup";
import { animated, useSpring } from "react-spring";
import { useMarketCaps } from "../api/market-caps";
import colors from "../colors";
import { BodyText, TextRoboto } from "./Texts";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

type Icon = "btc" | "gold" | "usd";

type ProgressBarProps = {
  highlightColor: string;
  showHighlight: boolean;
  progress: number;
};

const ProgressBar: FC<ProgressBarProps> = ({
  highlightColor,
  showHighlight,
  progress,
}) => {
  const { width } = useSpring({
    to: { width: clamp(progress * 100, 100) },
    from: { width: 0 },
  });

  const backgroundColor = showHighlight ? highlightColor : colors.spindle;

  return (
    <div className="relative">
      <div className="w-full h-2 rounded-full bg-blue-dusk"></div>
      <animated.div
        className="absolute top-0 h-2 rounded-full bg-blue-spindle"
        style={{
          width: width.to((width) => `${width}%`),
          background: backgroundColor,
        }}
      ></animated.div>
    </div>
  );
};

type RowProps = {
  highlightColor: string;
  icon: Icon;
  progress: number;
  title: string;
};

const Row: FC<RowProps> = ({ highlightColor, title, progress, icon }) => {
  const [hovering, setHovering] = useState(false);

  const blueishVisibleCss = hovering ? "invisible" : "visible";
  const colorVisibleCss = hovering ? "visible" : "invisible";

  return (
    <div
      className="flex flex-row items-start gap-x-4"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <img
        className={`select-none ${blueishVisibleCss}`}
        src={`/${icon}-blueish.svg`}
        alt={`${icon} icon`}
      />
      <img
        className={`absolute select-none ${colorVisibleCss}`}
        src={`/${icon}-color.svg`}
        alt={`${icon} icon`}
      />
      <div className="w-full flex flex-col justify-between">
        <ProgressBar
          highlightColor={highlightColor}
          showHighlight={hovering}
          progress={progress}
        />
        <div
          className="flex flex-row justify-between"
          style={{ paddingTop: "0.1875rem" }}
        >
          <BodyText>{title}</BodyText>
          <TextRoboto className="text-base md:text-lg">
            <CountUp
              decimals={2}
              duration={0.8}
              separator=","
              end={progress * 100}
              preserveValue={true}
              suffix={"%"}
            />
          </TextRoboto>
        </div>
      </div>
    </div>
  );
};

const Flippenings: FC = () => {
  const marketCaps = useMarketCaps();

  const btcProgress =
    marketCaps === undefined
      ? 0
      : marketCaps.ethMarketCap / marketCaps.btcMarketCap;

  const goldProgress =
    marketCaps === undefined
      ? 0
      : marketCaps.ethMarketCap / marketCaps.goldMarketCap;

  const usdProgress =
    marketCaps === undefined
      ? 0
      : marketCaps.ethMarketCap / marketCaps.usdM3MarketCap;

  return (
    <WidgetBackground>
      <WidgetTitle>flippenings</WidgetTitle>
      <div className="flex flex-col gap-y-4 mt-4">
        <Row
          icon="btc"
          highlightColor="linear-gradient(88.24deg, #FF891D -10.74%, #E8AB74 115.66%)"
          title="bitcoin"
          progress={btcProgress}
        />
        <Row
          icon="gold"
          highlightColor="linear-gradient(85.54deg, #FCD34D 3.61%, #FBE18C 528.11%)"
          title="gold"
          progress={goldProgress}
        />
        <Row
          icon="usd"
          highlightColor="linear-gradient(78.13deg, #A3D972 8.69%, #C4E6A5 1527.23%)"
          title="usd"
          progress={usdProgress}
        />
      </div>
    </WidgetBackground>
  );
};

export default Flippenings;
