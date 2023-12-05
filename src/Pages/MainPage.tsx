import logoIcon from "@/assets/logo.svg";
import { Box, Divider } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import { Obs } from "@/modules/types";
import { useRecoilState } from "recoil";
import { historyState, obsListState } from "@/modules/atoms";
import { Page } from "../modules/types";
import { pageState } from "@/modules/atoms";
import Description from "./Description";
import React from "react";
import SinglePointGraph from "./SinglePointGraph";
import MultiPointGraph from "./MultiPointGraph";
import "./MainPage.css";
import Notion from "./Notion";
import { getObsList } from "@/modules/apiConnect";

/**
 * ページのエントリポイント（各ページを動的切替）
 */
const MainPage = () => {
  const [_, setObsList] = useRecoilState<{ [key: string]: Obs }>(obsListState);
  const [__, setHistory] = useRecoilState<Obs[]>(historyState);
  const [page] = useRecoilState<Page>(pageState);

  React.useEffect(() => {
    // ローカルストレージからユーザの観測値選択履歴を取得
    const obsHistoryString = localStorage.getItem("obsHistory");
    if (obsHistoryString) {
      const obsHistory = JSON.parse(obsHistoryString);
      setHistory(obsHistory);
    }
    // ローカルストレージから全観測地リストを取得
    const obsListString = localStorage.getItem("obsList");
    if (obsListString) {
      const obsList = JSON.parse(obsListString);
      setObsList(obsList);
    } else {
      // ローカルストレージに無い場合は新規取得
      getObsList(setObsList);
    }
  }, []);

  return (
    <Box>
      <Box sx={{ minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ textAlign: "right", mt: 2, mr: 4 }}>
          <img src={logoIcon} className="logo-icon" />
        </Box>
        {page === "main" ? (
          <Description />
        ) : page === "single" ? (
          <SinglePointGraph />
        ) : page === "multi" ? (
          <MultiPointGraph />
        ) : page === "notion" ? (
          <Notion />
        ) : null}
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Box
        sx={{
          backgroundColor: "#EEEEEE",
          py: 1,
          px: 3,
          bottom: 0,
        }}
      >
        © 2023
        {new Date().getFullYear() > 2023
          ? "-" + new Date().getFullYear()
          : null}{" "}
        kako-ten.com All rights reserved
      </Box>
    </Box>
  );
};

export default MainPage;
