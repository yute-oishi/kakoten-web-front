import React from "react";
import { useRecoilState } from "recoil";
import { singlePageState, climateDataState } from "@/modules/atoms";
import DatePickerWithArrow from "@/Components/DatePickerWithArrows";
import { Box, Button, Grid, IconButton } from "@mui/material";
import {
  EachHourData,
  Obs,
  ObsForDataState,
  getHoursJson,
} from "@/modules/types";
import plusIcon from "@/assets/plus.svg";
import leftArrowDoubleIcon from "@/assets/left-arrow-double.svg";
import rightArrowDoubleIcon from "@/assets/right-arrow-double.svg";
import leftArrowIcon from "@/assets/left_arrow.svg";
import rightArrowIcon from "@/assets/right_arrow.svg";
import {
  addDays,
  addSpaceDate,
  dateDiff,
  dateToString,
  getBeforeDay,
  getDate,
  getObsCode,
  getYesterday,
} from "@/modules/dateUtils";
import { getClimateData } from "@/modules/apiConnect";
import Chart from "@/Components/Chart";
import { elemEnToJp, elemlist } from "@/modules/climateUtils";
import {
  getResponsiveFocusedButtonSx,
  getResponsiveTransparentButtonSx,
} from "@/modules/styles";
import crossIcon from "@/assets/cross.svg";
import useMedia from "@/hooks/useMedia";
import CustomTooltip from "@/Components/CustomTooltip";

/**
 * 1地点のグラフ画面
 */
const SinglePointGraph = () => {
  const [data, setData] = useRecoilState<ObsForDataState>(climateDataState);
  const [obs] = useRecoilState<Obs>(singlePageState);
  const [dates, setDates] = React.useState<Date[]>([getYesterday()]);
  const [chartData, setChartData] = React.useState<EachHourData[]>([]);
  const [elems, setElems] = React.useState<string[]>([]);
  const [leftElem, setLeftElem] = React.useState<string>("pc");
  const [rightElem, setRightElem] = React.useState<string>("");
  const [isGraphLoading, setIsGraphLoading] = React.useState<boolean>(false);
  const isSmallScreen = useMedia("(max-width: 600px)");

  const [datePickerDisabled, setDatePickerDisabled] =
    React.useState<boolean>(false);

  // ページ(観測地点)切替り時の初期化
  React.useEffect(() => {
    setDates([getYesterday()]);
    setLeftElem("pc");
    setRightElem("");
  }, [obs]);

  // 観測地点、日付が変更されたときのグラフデータ作成処理
  React.useEffect(() => {
    const graphData: EachHourData[] = getHoursJson();
    const newElems = new Set<string>();
    const dateStrings = dates.map((date) => dateToString(date));
    Object.entries(data).map(([key, value]) => {
      const obsCode = getObsCode(key);
      const date = getDate(key);
      if (obs.obsCode === obsCode && dateStrings.includes(date)) {
        Object.entries(value).map(([hour, climates]) => {
          const hourNumber = parseInt(hour, 10);
          Object.entries(climates).map(([element, climateValue]) => {
            newElems.add(element);
            const elemJp = elemEnToJp[element];
            graphData[hourNumber - 1][`${addSpaceDate(date)} ${elemJp}`] =
              climateValue;
          });
        });
      }
    });
    setElems([...newElems]);
    setChartData(graphData);
  }, [data, obs, dates]);

  // 気象データをAPIから取得
  const setClimateData = async (query: string) => {
    setDatePickerDisabled(true);
    setIsGraphLoading(true);
    const newData = await getClimateData(query);
    setData({ ...data, ...newData });
    setIsGraphLoading(false);
    setDatePickerDisabled(false);
  };

  // 持っていない気象データをAPIから取得
  React.useEffect(() => {
    let getDatalist: string = "";
    dates.map((d) => {
      if (!(obs.obsCode + dateToString(d) in data)) {
        getDatalist += obs.obsCode + dateToString(d) + ",";
      }
    });
    if (getDatalist !== "") {
      setClimateData(getDatalist.slice(0, -1));
    }
  }, [dates, obs]);

  // 全ての日付をまとめてn移動させる
  const moveAllDates = (n: number) => {
    const newDates = dates.map((date) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + n);
      return newDate;
    });
    setDates(newDates);
  };

  return (
    <Box
      sx={{
        m: isSmallScreen ? 1 : 5,
        borderRadius: 9,
        border: "solid 1.5px #CDCDCD",
        backgroundColor: "#EFEFEF",
      }}
    >
      <Box sx={{ fontSize: 28, my: 3, mx: 5 }}>
        {obs?.pref} {obs?.kjName}
      </Box>
      <Grid container>
        {dates.map((date, index) => (
          <Grid
            key={index}
            item
            xs={12}
            xssm={6}
            lg={3}
            sx={{
              position: "relative",
              left: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <DatePickerWithArrow
              maxDate={addDays(new Date(), -1)}
              minDate={new Date("2023-11-14")}
              props={{ disabled: datePickerDisabled }}
              style={{
                height: isSmallScreen ? 30 : 50,
                width: isSmallScreen ? 220 : 260,
                fontSize: isSmallScreen ? "13px" : "16px",
              }}
              initialDate={date}
              handleChangeDate={(date) => {
                const newDates = [...dates];
                newDates[index] = date;
                setDates(newDates);
              }}
            />
            {index === 0 ? (
              <Box sx={{ width: "36px" }}></Box>
            ) : (
              <IconButton
                sx={{ position: "relative", top: "-20px", left: "-12px" }}
                onClick={() => {
                  setDates([
                    ...dates.slice(0, index),
                    ...dates.slice(index + 1),
                  ]);
                }}
              >
                <img src={crossIcon} />
              </IconButton>
            )}
          </Grid>
        ))}

        {dates.length < 4 ? (
          <Grid
            item
            xs={12}
            smmd={6}
            lg={3}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              top: "-15px",
            }}
          >
            <IconButton
              onClick={() => {
                setDates([...dates, getBeforeDay(dates[dates.length - 1], 1)]);
              }}
            >
              <img src={plusIcon} />
            </IconButton>
          </Grid>
        ) : null}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CustomTooltip title="全日付をまとめて4日前に移動します。">
          <span>
            <IconButton
              disabled={
                datePickerDisabled ||
                dates.some((date) => dateDiff(new Date("2023-11-14"), date, 5))
              }
              onClick={() => {
                moveAllDates(-4);
              }}
            >
              <img src={leftArrowDoubleIcon} />
            </IconButton>
          </span>
        </CustomTooltip>
        <CustomTooltip title="全日付をまとめて1日前に移動します。">
          <span>
            <IconButton
              disabled={
                datePickerDisabled ||
                dates.some((date) => dateDiff(new Date("2023-11-14"), date, 2))
              }
              onClick={() => {
                moveAllDates(-1);
              }}
            >
              <img
                style={{ position: "relative", top: "1px" }}
                src={leftArrowIcon}
              />
            </IconButton>
          </span>
        </CustomTooltip>
        <CustomTooltip title="全日付をまとめて1日後に移動します。">
          <span>
            <IconButton
              disabled={
                datePickerDisabled ||
                dates.some((date) => dateDiff(date, new Date(), 2))
              }
              onClick={() => {
                moveAllDates(1);
              }}
            >
              <img
                style={{ position: "relative", top: "1px" }}
                src={rightArrowIcon}
              />
            </IconButton>
          </span>
        </CustomTooltip>
        <CustomTooltip title="全日付をまとめて4日後に移動します。">
          <span>
            <IconButton
              disabled={
                datePickerDisabled ||
                dates.some((date) => dateDiff(date, new Date(), 5))
              }
              onClick={() => {
                moveAllDates(4);
              }}
            >
              <img src={rightArrowDoubleIcon} />
            </IconButton>
          </span>
        </CustomTooltip>
      </Box>
      <Chart
        isLoading={isGraphLoading}
        data={chartData}
        leftKeys={
          new Set(
            dates.map(
              (date) =>
                `${addSpaceDate(dateToString(date))} ${elemEnToJp[leftElem]}`
            )
          )
        }
        rightKeys={
          rightElem === ""
            ? new Set()
            : new Set(
                dates.map(
                  (date) =>
                    `${addSpaceDate(dateToString(date))} ${
                      elemEnToJp[rightElem]
                    }`
                )
              )
        }
        leftLabel={elemEnToJp[leftElem]}
        rightLabel={elemEnToJp[rightElem]}
      />
      <Grid
        container
        sx={{ justifyContent: "space-between", p: isSmallScreen ? 1 : 3 }}
      >
        <Grid item xs={5.5}>
          {elemlist.map((elem) => (
            <Button
              key={elem.jp}
              sx={
                elem.en === leftElem
                  ? getResponsiveFocusedButtonSx(isSmallScreen)
                  : getResponsiveTransparentButtonSx(isSmallScreen)
              }
              disabled={
                elems.includes(elem.en) && elem.en !== rightElem ? false : true
              }
              onClick={() => {
                setLeftElem(elem.en);
              }}
            >
              {elem.jp}
            </Button>
          ))}
        </Grid>
        <Grid item xs={5.5} sx={{ justifyContent: "flex-end" }}>
          {elemlist.map((elem) => (
            <Button
              key={elem.en}
              sx={
                elem.en === rightElem
                  ? getResponsiveFocusedButtonSx(isSmallScreen)
                  : getResponsiveTransparentButtonSx(isSmallScreen)
              }
              disabled={
                elems.includes(elem.en) && elem.en !== leftElem ? false : true
              }
              onClick={() => {
                if (elem.en === rightElem) {
                  setRightElem("");
                } else {
                  setRightElem(elem.en);
                }
              }}
            >
              {elem.jp}
            </Button>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SinglePointGraph;
