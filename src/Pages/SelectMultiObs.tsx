import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Modal,
  SxProps,
  Tab,
  Tabs,
  TextField,
  Theme,
  useTheme,
} from "@mui/material";
import React from "react";
import infoIcon from "@/assets/info.svg";
import crossIcon from "@/assets/cross.svg";
import { useRecoilState } from "recoil";
import { pref } from "@/modules/pref";
import { obsListState, historyState } from "@/modules/atoms";
import { Obs } from "../modules/types";
import { ObsCodeMain, prefCode } from "../modules/pref";
import { getElemType } from "@/modules/climateUtils";
import CustomTooltip from "@/Components/CustomTooltip";
import {
  decideButtonSx,
  focusedButtonSx,
  normalButtonSx,
  selectedObsSx,
} from "@/modules/styles";

const SelectMultiObs = ({
  open,
  setOpen,
  handleFinish,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFinish: (obss: Obs[]) => void;
}) => {
  const [history, setHistory] = useRecoilState<Obs[]>(historyState);
  const [obsList] = useRecoilState<{ [key: string]: Obs }>(obsListState);
  const [searchText, setSearchText] = React.useState<string>("");
  const [filteredObs, setFilteredObs] = React.useState<{
    [key: string]: { [key: string]: Obs }[];
  }>({});
  const [selectedPref, setSelectedPref] = React.useState<string>("");
  const [value, setValue] = React.useState(0);
  const [textFieldKey, setTextFieldKey] = React.useState<number>(0);
  const [obss, setObss] = React.useState<Obs[]>([]);
  const [selectedObsCodes, setSelectedObsCodes] = React.useState<string[]>([]);

  // レスポンシブ対応
  const theme = useTheme();
  const style: SxProps<Theme> = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    [theme.breakpoints.up("lg")]: {
      width: "40%",
    },
    [theme.breakpoints.down("lg")]: {
      width: "60%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    border: "2px solid #AAAAAA",
    backgroundColor: "#EDEDED",
    borderRadius: 4,
    p: 1,
  };

  const addHistory = (obss: Obs[]) => {
    // 既に履歴にある場合、既にあるものを0番目に持ってくる
    let newHistory = [...history];
    obss.map((obs) => {
      const historyObsCodes = newHistory.map((his) => his.obsCode);
      if (historyObsCodes.includes(obs.obsCode)) {
        newHistory = [
          obs,
          ...newHistory.filter((his) => his.obsCode !== obs.obsCode),
        ];
      } else if (history.length > 17) {
        newHistory = [
          obs,
          ...newHistory.filter((_, index) => index !== history.length - 1),
        ];
      } else {
        newHistory = [obs, ...newHistory];
      }
    });
    setHistory(newHistory);
    localStorage.setItem("obsHistory", JSON.stringify(newHistory));
  };

  React.useEffect(() => {
    setSelectedObsCodes(obss.map((o) => o.obsCode));
  }, [obss]);

  const handleClickObs = (obs: Obs) => {
    // 既に上限の場合
    if (obss.length === 4) {
      return;
    }
    // 正常に追加できる場合
    setObss([...obss, obs]);
  };

  const handleClickDecide = () => {
    if (obss.length === 0) {
      return;
    }
    addHistory(obss);
    handleFinish(obss);
    setInit();
  };

  const setInit = () => {
    setValue(0);
    setSearchText("");
    setSelectedPref("");
    setObss([]);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setTextFieldKey(textFieldKey + 1);
    setSearchText("");
    setSelectedPref("");
  };

  const handleBlur = (text: string) => {
    setSearchText(text);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleBlur((event.target as HTMLInputElement).value);
    }
  };
  React.useEffect(() => {
    if (searchText === "") {
      setFilteredObs({});
      return;
    }

    const filteredObs: {
      [key: string]: { [key: string]: Obs }[];
    } = {};
    Object.keys(obsList)
      .filter((key) => obsList[key].kjName.includes(searchText))
      .map((key) => {
        if (!(obsList[key].pref in filteredObs)) {
          filteredObs[obsList[key].pref] = [{ [key]: obsList[key] }];
        } else {
          filteredObs[obsList[key].pref].push({ [key]: obsList[key] });
        }
      });
    setFilteredObs(filteredObs);
  }, [searchText]);

  const searchTextField = () => {
    return (
      <TextField
        sx={{ mx: 4, width: 112 }}
        key={textFieldKey}
        label="観測所を検索"
        defaultValue=""
        variant="standard"
        onKeyDown={handleKeyDown}
        onBlur={(
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          handleBlur(event.target.value);
        }}
      />
    );
  };

  const prefList = () => {
    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ mt: 2 }}>・ 都道府県一覧</Box>
          {searchTextField()}
        </Box>
        <Grid
          sx={{
            fontSize: "18px",
            overflowY: "auto",
            height: 300,
            m: 1,
          }}
        >
          {pref.map((p: string) => (
            <Button
              key={p}
              sx={{ m: 0.5 }}
              onClick={() => {
                setSelectedPref(p);
              }}
            >
              {p}
            </Button>
          ))}
        </Grid>
      </>
    );
  };

  const searchFilteredObs = () => {
    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={() => {
              setTextFieldKey(textFieldKey + 1);
              setSearchText("");
            }}
          >
            {"< 戻る"}
          </Button>
          {searchTextField()}
        </Box>
        <Grid
          sx={{
            overflowY: "auto",
            height: 300,
            m: 1,
          }}
        >
          {Object.keys(filteredObs).map((pref) => (
            <Box key={pref}>
              <Box>{pref}</Box>
              {filteredObs[pref].map((obs) =>
                Object.entries(obs).map(([key, value]) => (
                  <Button
                    key={key}
                    sx={
                      selectedObsCodes.includes(value.obsCode)
                        ? focusedButtonSx
                        : normalButtonSx
                    }
                    onClick={() => {
                      handleClickObs(value);
                    }}
                  >
                    {getElemType(value.elems)} {value.kjName}
                  </Button>
                ))
              )}
            </Box>
          ))}
        </Grid>
      </>
    );
  };

  const prefFilteredObs = () => {
    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={() => setSelectedPref("")}>{"< 戻る"}</Button>
          <Box sx={{ mt: 2, mr: 10 }}>{selectedPref}</Box>
        </Box>
        <Grid
          sx={{
            overflowY: "auto",
            height: 310,
            m: 1,
          }}
        >
          {Object.keys(obsList)
            .filter(
              (key) =>
                prefCode[selectedPref][0] <= parseInt(key.slice(0, 2)) &&
                prefCode[selectedPref][1] >= parseInt(key.slice(0, 2))
            )
            .map((key) => (
              <Button
                key={key}
                sx={
                  selectedObsCodes.includes(obsList[key].obsCode)
                    ? focusedButtonSx
                    : normalButtonSx
                }
                onClick={() => {
                  handleClickObs(obsList[key]);
                }}
              >
                {getElemType(obsList[key].elems)} {obsList[key].kjName}
              </Button>
            ))}
        </Grid>
      </>
    );
  };

  const mainAndHistory = () => {
    return (
      <Box
        sx={{
          height: 364,
          overflowY: "auto",
        }}
      >
        <Box sx={{ mt: 2 }}>・ 主要観測所</Box>
        {Object.entries(ObsCodeMain).map(([key, value]) => (
          <Button
            key={key}
            sx={
              selectedObsCodes.includes(value.toString())
                ? focusedButtonSx
                : normalButtonSx
            }
            onClick={() => {
              handleClickObs(obsList[value.toString()]);
            }}
          >
            A {key}
          </Button>
        ))}
        <Box sx={{ mt: 0.5 }}>・ 履歴</Box>
        {history.map((his, index) => (
          <Button
            key={index}
            sx={
              selectedObsCodes.includes(his.obsCode)
                ? focusedButtonSx
                : normalButtonSx
            }
            onClick={() => {
              handleClickObs(his);
            }}
          >
            {his.kjName}
          </Button>
        ))}
      </Box>
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setInit();
        setOpen(false);
      }}
    >
      <Box sx={style}>
        <Tabs
          value={value}
          onChange={handleChange}
          style={{ color: "white", display: "flex" }}
        >
          <Tab
            label="都道府県から"
            sx={{ color: "black", fontSize: 12, zIndex: 3 }}
          />
          <Tab
            label="主要場所・履歴"
            sx={{ color: "black", fontSize: 12, zIndex: 3 }}
          />
        </Tabs>
        <CustomTooltip
          placement="top-end"
          arrow={false}
          title={
            <>
              <Box>観測所の左側のアルファベットは、観測項目を表します。</Box>
              <Box>A: 降水量, 温度, 風速, 日照時間, 湿度, 気圧</Box>
              <Box>B: 降水量, 温度, 風速, 日照時間, 湿度</Box>
              <Box>C: 降水量, 温度, 風速, 日照時間</Box>
              <Box>D: 降水量, 温度, 風速</Box>
              <Box>E: 降水量のみ</Box>
            </>
          }
        >
          <Box
            sx={{
              position: "relative",
              top: "-40px",
              left: "-8px",
              textAlign: "right",
              zIndex: 2,
            }}
          >
            <img src={infoIcon} />
          </Box>
        </CustomTooltip>
        {value === 0
          ? selectedPref === "" && searchText === ""
            ? prefList()
            : selectedPref === "" && searchText !== ""
            ? searchFilteredObs()
            : prefFilteredObs()
          : mainAndHistory()}
        <Divider />
        <Box sx={{ mx: 1 }}>最大4箇所まで選択できます。</Box>
        <Grid container sx={{ mt: 1 }}>
          <Grid container item xs={10} sx={{ display: "flex" }}>
            {obss.map((obs, index) => (
              <Box key={index} sx={{ display: "flex", mb: 1 }}>
                <Box sx={{ ...selectedObsSx }}>
                  {getElemType(obs.elems)} {obs.kjName}
                </Box>
                <IconButton
                  sx={{
                    position: "relative",
                    left: "-15px",
                    top: "-4px",
                    width: "10px",
                    height: "10px",
                  }}
                  onClick={() => {
                    setObss([
                      ...obss.slice(0, index),
                      ...obss.slice(index + 1),
                    ]);
                  }}
                >
                  <img src={crossIcon} />
                </IconButton>
              </Box>
            ))}
          </Grid>
          <Grid item xs={2} sx={{ display: "flex", justifyContent: "right" }}>
            <Button sx={decideButtonSx} onClick={handleClickDecide}>
              決定
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SelectMultiObs;
