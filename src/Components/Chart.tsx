import Box from "@mui/material/Box";
import {
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
  Legend,
  Label,
  ResponsiveContainer,
  TooltipProps,
  LegendProps,
  LabelProps,
  ComposedChart,
  Bar,
} from "recharts";
import { Payload as LegendPayload } from "recharts/types/component/DefaultLegendContent";
import { Payload as TooltipPayload } from "recharts/types/component/DefaultTooltipContent";
import React from "react";
import { Grid, SxProps, Theme } from "@mui/material";
import { EachHourData } from "@/modules/types";
import { buttonColors } from "@/modules/styles";
import useMedia from "@/hooks/useMedia";
import loadingIcon from "@/assets/loading.svg";

export const bgTooltipSx: SxProps<Theme> = {
  position: "relative",
  left: "-30px",
  fontSize: "13px",
  backgroundColor: "#7F7F7F",
  color: "white",
  padding: "10px",
  borderRadius: 3,
  width: "240px",
};

const CustomLabelContent = (props: LabelProps) => {
  if (
    props.viewBox !== undefined &&
    "x" in props.viewBox &&
    "y" in props.viewBox
  ) {
    const { x, y } = props.viewBox;
    const offset = props.index === 0 ? 20 : -20;
    if (x !== undefined && y !== undefined) {
      return (
        <text x={x + offset} y={y - 20} fontSize={14}>
          {props.value}
        </text>
      );
    }
  }
  return null;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && label) {
    const [hours, minutes] = label.split(":").map(Number);
    const halfHourago: string = `${String(hours - 1).padStart(2, "0")}:
                                 ${String(minutes).padStart(2, "0")}`;

    return (
      <Box className="custom-tooltip" sx={bgTooltipSx}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#cccccc",
          }}
        >
          <Box>{`${halfHourago} ～ ${label}`}</Box>
        </Box>
        {payload.map((entry: TooltipPayload<number, string>, index: number) => (
          <Box
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg width={10} height={10} style={{ marginRight: "3" }}>
                <circle cx={5} cy={5} r={3} fill={entry.color} />
              </svg>

              {entry.name}
            </Box>

            <Box>{`${entry.value?.toLocaleString()}`}</Box>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

/**
 * グラフ描画コンポーネント
 * @param data jsonデータ
 * @param xKey 横軸となるデータのキー名
 * @param yKeys 縦軸となるデータのキー名（文字列）リスト、最大5個まで
 */
const Chart = ({
  data,
  leftKeys,
  rightKeys = new Set<string>(),
  leftLabel = "",
  rightLabel = "",
  isLoading = false,
}: {
  data: EachHourData[];
  leftKeys: Set<string>;
  rightKeys: Set<string>;
  leftLabel?: string;
  rightLabel?: string;
  isLoading?: boolean;
}) => {
  const [disabledKeys, setDisabledKeys] = React.useState<Set<string>>(
    new Set()
  );
  const [displayedData, setDisplayedData] =
    React.useState<EachHourData[]>(data);
  const isSmallScreen = useMedia("(max-width: 600px)");

  React.useEffect(() => {
    const filteredData: EachHourData[] = data.map((d) => {
      const entries = Object.entries(d).filter(([key]) => {
        return key === "time" || !disabledKeys.has(key);
      });
      return Object.fromEntries(entries);
    }) as EachHourData[];
    setDisplayedData(filteredData);
  }, [data, disabledKeys]);

  const CustomizedLegend = ({ payload }: LegendProps) => {
    return (
      <Grid
        container
        sx={{ mb: "40px", display: "flex", justifyContent: "center" }}
      >
        {Array.isArray(payload) &&
          payload.map((entry: LegendPayload, index: number) => (
            <Box
              key={index}
              sx={{
                mx: "10px",
                fontSize: "14px",
                color: disabledKeys.has(entry.value) ? "#BBBBBB" : entry.color,
                cursor: "pointer",
              }}
              // 凡例クリック時の処理（表示非表示切替）
              onClick={() => {
                const newDisableKeys = new Set(disabledKeys);
                if (disabledKeys.has(entry.value)) {
                  newDisableKeys.delete(entry.value);
                  setDisabledKeys(newDisableKeys);
                } else {
                  newDisableKeys.add(entry.value);
                  setDisabledKeys(newDisableKeys);
                }
              }}
            >
              <svg width={10} height={10} style={{ marginRight: "3" }}>
                <circle
                  cx={5}
                  cy={5}
                  r={5}
                  fill={disabledKeys.has(entry.value) ? "#BBBBBB" : entry.color}
                />
              </svg>
              {entry.value}
            </Box>
          ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ fontSize: "14px", position: "relative", left: "-12px" }}>
      {isLoading && (
        <Box
          sx={{
            position: "relative",
            top: "200px",
            left: "10px",
            textAlign: "center",
          }}
        >
          <img src={loadingIcon} />
        </Box>
      )}
      <ResponsiveContainer width={isSmallScreen ? "105%" : "100%"} height={400}>
        <ComposedChart width={1000} height={400} data={displayedData}>
          <CartesianGrid stroke="#dddddd" vertical={false} />
          <XAxis dataKey={"time"} tickLine={false} />
          <YAxis yAxisId="left" fontSize={12} axisLine={false} tickLine={false}>
            <Label
              position="top"
              content={<CustomLabelContent value={leftLabel} index={0} />}
            />
          </YAxis>
          <YAxis
            yAxisId="right"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            orientation="right"
          >
            <Label
              position="top"
              content={<CustomLabelContent value={rightLabel} index={1} />}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomizedLegend />} verticalAlign="top" />
          <Brush dataKey={"time"} stroke="#8884d8" height={24} />

          {[...leftKeys].map((dataKey, index) => {
            if (dataKey) {
              if (dataKey.includes("降水量")) {
                return (
                  <Bar
                    yAxisId="left"
                    dataKey={dataKey.toString()}
                    key={"left" + index.toString() + "pc"}
                    barSize={20}
                    fill={buttonColors[index] + "DD"}
                  />
                );
              } else {
                return (
                  <Line
                    yAxisId="left"
                    connectNulls
                    isAnimationActive={false}
                    dot={{ fill: buttonColors[index], r: 2 }}
                    key={"left" + index.toString()}
                    type="monotone"
                    dataKey={dataKey.toString()}
                    stroke={buttonColors[index]}
                  />
                );
              }
            }
          })}
          {[...rightKeys].map((dataKey, index) => {
            if (dataKey && !leftKeys.has(dataKey)) {
              if (dataKey.includes("降水量")) {
                return (
                  <Bar
                    yAxisId="right"
                    dataKey={dataKey.toString()}
                    key={"right" + index.toString() + "pc"}
                    barSize={20}
                    fill={buttonColors[index + 4] + "DD"}
                  />
                );
              } else {
                return (
                  <Line
                    yAxisId="right"
                    connectNulls
                    isAnimationActive={false}
                    dot={{ fill: buttonColors[index + 4], r: 2 }}
                    key={"right" + index.toString()}
                    type="monotone"
                    dataKey={dataKey.toString()}
                    stroke={buttonColors[index + 4]}
                  />
                );
              }
            }
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;
