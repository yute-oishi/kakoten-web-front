import {
  Box,
  Button,
  Grid,
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
import { useRecoilState } from "recoil";
import { pref } from "@/modules/pref";
import { obsListState, historyState } from "@/modules/atoms";
import { Obs } from "../modules/types";
import { ObsCodeMain, prefCode } from "../modules/pref";
import { getElemType } from "@/modules/climateUtils";
import CustomTooltip from "@/Components/CustomTooltip";

/**
 * 1地点選択モーダル
 */
const SelectObsModal = ({
  open,
  setOpen,
  setObs,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setObs: (obs: Obs) => void;
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
  const [tooltipOpen, setTooltipOpen] = React.useState<boolean>(false);

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

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

  const addHistory = (obs: Obs) => {
    // 既に履歴にある場合、既にあるものを0番目に持ってくる
    const historyObsCodes = history.map((his) => his.obsCode);
    let newHistory: Obs[] = [...history];
    if (historyObsCodes.includes(obs.obsCode)) {
      newHistory = [
        obs,
        ...newHistory.filter((his) => his.obsCode !== obs.obsCode),
      ];
      // 履歴には無く、履歴制限がMAX18の場合
    } else if (history.length > 17) {
      newHistory = [
        obs,
        ...newHistory.filter((_, index) => index !== history.length - 1),
      ];
      // 履歴には無く、履歴制限以下の場合
    } else {
      newHistory = [obs, ...newHistory];
    }
    setHistory(newHistory);
    localStorage.setItem("obsHistory", JSON.stringify(newHistory));
  };

  // 観測地点クリック時の処理
  const handleClick = (obs: Obs) => {
    setObs(obs);
    addHistory(obs);
    setInit();
  };

  // 初期化
  const setInit = () => {
    setSearchText("");
    setSelectedPref("");
    setValue(0);
  };

  // タブ切替操作時の処理
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setTextFieldKey(textFieldKey + 1);
    setSearchText("");
    setSelectedPref("");
  };

  // テキストボックス入力完了時の処理
  const handleBlur = (text: string) => {
    setSearchText(text);
  };

  // テキストボックスでエンターキー押下時の処理
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleBlur((event.target as HTMLInputElement).value);
    }
  };

  // テキストボックスでの検索処理
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

  // 検索テキスト入力テキストボックス
  const searchTextField = () => {
    return (
      <TextField
        sx={{ mx: 4 }}
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

  // 都道府県一覧カード
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
              sx={{ m: 1 }}
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

  // 検索テキストでのフィルタリングされた観測地点一覧カード
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
                    sx={{ m: 1 }}
                    onClick={() => {
                      handleClick(value);
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

  // 1都道府県の観測地点一覧カード
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
                sx={{ m: 1 }}
                onClick={() => {
                  handleClick(obsList[key]);
                }}
              >
                {getElemType(obsList[key].elems)} {obsList[key].kjName}
              </Button>
            ))}
        </Grid>
      </>
    );
  };

  // 主要都市及び履歴の一覧カード
  const mainAndHistory = () => {
    return (
      <Box
        sx={{
          height: 364,
          overflowY: "auto",
        }}
      >
        <Box sx={{ mt: 2 }}>・ 主要地点</Box>
        {Object.entries(ObsCodeMain).map(([key, value]) => (
          <Button
            key={key}
            sx={{ m: 1 }}
            onClick={() => {
              handleClick(obsList[value.toString()]);
            }}
          >
            A {key}
          </Button>
        ))}
        <Box sx={{ mt: 0.5 }}>・ 履歴</Box>
        {history.map((his, index) => (
          <Button
            key={index}
            sx={{ m: 1 }}
            onClick={() => {
              handleClick(his);
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
            label="主要地点・履歴"
            sx={{ color: "black", fontSize: 12, zIndex: 3 }}
          />
        </Tabs>
        <CustomTooltip
          onClose={handleTooltipClose}
          open={tooltipOpen}
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
            <img onClick={handleTooltipOpen} src={infoIcon} />
          </Box>
        </CustomTooltip>

        {value === 0
          ? selectedPref === "" && searchText === ""
            ? prefList()
            : selectedPref === "" && searchText !== ""
            ? searchFilteredObs()
            : prefFilteredObs()
          : mainAndHistory()}
      </Box>
    </Modal>
  );
};

export default SelectObsModal;
