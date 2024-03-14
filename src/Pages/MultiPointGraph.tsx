import React from "react";
import { useRecoilState } from "recoil";
import {
  multiPageState,
  climateDataState,
  pageState,
  obsListState,
} from "@/modules/atoms";
import DatePickerWithArrow from "@/Components/DatePickerWithArrows";
import { Box, Button, Grid, IconButton } from "@mui/material";
import {
  EachHourData,
  Obs,
  ObsForDataState,
  Page,
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
import SelectObsModal from "./SelectObsModal";

/**
 * 複数地点比較のグラフ画面
 */
const MultiPointGraph = () => {
  const [obsList] = useRecoilState<{ [key: string]: Obs }>(obsListState);
  const [data, setData] = useRecoilState<ObsForDataState>(climateDataState);
  const [page] = useRecoilState<Page>(pageState);
  const [obsDates, setObsDates] = useRecoilState<[Obs, Date][]>(multiPageState);
  const [chartData, setChartData] = React.useState<EachHourData[]>([]);
  const [elems, setElems] = React.useState<string[]>([]);
  const [leftElem, setLeftElem] = React.useState<string>("pc");
  const [rightElem, setRightElem] = React.useState<string>("");
  const [selectedObsCodes, setSelectedObsCodes] = React.useState<string[]>([]);
  const isSmallScreen = useMedia("(max-width: 600px)");
  const [isGraphLoading, setIsGraphLoading] = React.useState<boolean>(false);
  const [datePickerDisabled, setDatePickerDisabled] =
    React.useState<boolean>(false);
  const [singleModalOpen, setSingleModalOpen] = React.useState<boolean>(false);
  const [focusIndex, setFocusIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    setSelectedObsCodes(obsDates.map((o) => o[0].obsCode));
  }, [obsDates]);

  // ページ切替り時の初期化
  React.useEffect(() => {
    if (page !== "multi") {
      setObsDates([]);
      setLeftElem("pc");
      setRightElem("");
    }
  }, [page]);

  // 観測地点、日付が変更されたときのグラフデータ作成処理
  React.useEffect(() => {
    const graphData: EachHourData[] = getHoursJson();
    const newElems = new Set<string>();
    Object.entries(data).map(([key, value]) => {
      const obsCode = getObsCode(key);
      const date = getDate(key);
      const kjName = obsList[obsCode].kjName;
      if (selectedObsCodes.includes(obsCode)) {
        Object.entries(value).map(([hour, climates]) => {
          const hourNumber = parseInt(hour, 10);
          Object.entries(climates).map(([element, climateValue]) => {
            newElems.add(element);
            const elemJp = elemEnToJp[element];
            graphData[hourNumber - 1][
              `${addSpaceDate(date)} ${kjName} ${elemJp}`
            ] = climateValue;
          });
        });
      }
    });
    setElems([...newElems]);
    setChartData(graphData);
  }, [data, obsDates]);

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
    obsDates.map((obsDate) => {
      if (!(obsDate[0].obsCode + dateToString(obsDate[1]) in data)) {
        getDatalist += obsDate[0].obsCode + dateToString(obsDate[1]) + ",";
      }
    });
    if (getDatalist !== "") {
      setClimateData(getDatalist.slice(0, -1));
    }
  }, [obsDates]);

  // 全ての日付をまとめてn移動させる
  const moveAllDates = (n: number) => {
    const newObsDates: [Obs, Date][] = [];
    obsDates.map((obsDate) => {
      const newDate = new Date(obsDate[1]);
      newDate.setDate(newDate.getDate() + n);
      newObsDates.push([obsDate[0], newDate]);
    });
    setObsDates(newObsDates);
  };

  // 観測地点を追加する
  const addObs = (obs: Obs) => {
    if (obsDates.length === 4) {
      return;
    }
    const newObsDates = [...obsDates];
    newObsDates.push([obs, getYesterday()]);
    setObsDates(newObsDates);
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
      <SelectObsModal
        open={singleModalOpen}
        setOpen={setSingleModalOpen}
        setObs={(obs: Obs) => {
          if (focusIndex === -1) {
            addObs(obs);
          } else {
            setObsDates([
              ...obsDates.slice(0, focusIndex),
              [obs, obsDates[focusIndex][1]],
              ...obsDates.slice(focusIndex + 1),
            ]);
          }
          setSingleModalOpen(false);
        }}
      />
      <Grid container sx={{ mt: 3 }}>
        {obsDates.map((obsDate, index) => (
          <Grid
            key={index}
            item
            xs={12}
            md={6}
            xl={3}
            sx={{
              position: "relative",
              left: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Button
              onClick={() => {
                setFocusIndex(index);
                setSingleModalOpen(true);
              }}
            >
              {obsDate[0].kjName}
            </Button>
            <DatePickerWithArrow
              maxDate={addDays(new Date(), -1)}
              minDate={new Date("2023-11-14")}
              props={{ disabled: datePickerDisabled }}
              style={{
                height: isSmallScreen ? 30 : 50,
                width: isSmallScreen ? 220 : 260,
                fontSize: isSmallScreen ? "13px" : "16px",
              }}
              initialDate={obsDate[1]}
              handleChangeDate={(date) => {
                const newObsDates = [...obsDates];
                newObsDates[index] = [obsDate[0], date];
                setObsDates(newObsDates);
              }}
            />
            {index === 0 ? (
              <Box sx={{ width: "36px" }}></Box>
            ) : (
              <IconButton
                sx={{ position: "relative", top: "-20px", left: "-12px" }}
                onClick={() => {
                  setObsDates([
                    ...obsDates.slice(0, index),
                    ...obsDates.slice(index + 1),
                  ]);
                }}
              >
                <img src={crossIcon} />
              </IconButton>
            )}
          </Grid>
        ))}

        {obsDates.length < 4 ? (
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
                setFocusIndex(-1);
                setSingleModalOpen(true);
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
                obsDates
                  .map((obsDate) => obsDate[1])
                  .some((date) => dateDiff(new Date("2023-11-14"), date, 5))
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
                obsDates
                  .map((obsDate) => obsDate[1])
                  .some((date) => dateDiff(new Date("2023-11-14"), date, 2))
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
                obsDates
                  .map((obsDate) => obsDate[1])
                  .some((date) => dateDiff(date, new Date(), 2))
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
                obsDates
                  .map((obsDate) => obsDate[1])
                  .some((date) => dateDiff(date, new Date(), 5))
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
            obsDates.map(
              (obsDate) =>
                `${addSpaceDate(dateToString(obsDate[1]))} ${
                  obsDate[0].kjName
                } ${elemEnToJp[leftElem]}`
            )
          )
        }
        rightKeys={
          rightElem === ""
            ? new Set()
            : new Set(
                obsDates.map(
                  (obsDate) =>
                    `${addSpaceDate(dateToString(obsDate[1]))} ${
                      obsDate[0].kjName
                    } ${elemEnToJp[rightElem]}`
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

export default MultiPointGraph;
