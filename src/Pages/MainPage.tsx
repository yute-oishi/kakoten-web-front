import logoIcon from "@/assets/logo.svg";
import { Box, Divider } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import { Obs } from "@/modules/types";
import { useRecoilState } from "recoil";
import { historyState, obsListState } from "@/modules/atoms";
import { Page } from "../modules/types";
import { pageState } from "@/modules/atoms";
import Description from "./Description";
import { codePref } from "../modules/pref";
import React from "react";
import SinglePoint from "./SinglePoint";
import MultiPoint from "./MultiPoint";
import "./MainPage.css";
import Notion from "./Notion";

const MainPage = () => {
  const [_, setObsList] = useRecoilState<{ [key: string]: Obs }>(obsListState);
  const [__, setHistory] = useRecoilState<Obs[]>(historyState);
  const [page] = useRecoilState<Page>(pageState);

  React.useEffect(() => {
    const obsHistoryString = localStorage.getItem("obsHistory");
    if (obsHistoryString) {
      const obsHistory = JSON.parse(obsHistoryString);
      setHistory(obsHistory);
    }
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://www.jma.go.jp/bosai/amedas/const/amedastable.json",
        {
          mode: "cors",
          method: "GET",
          headers: new Headers(),
        }
      );
      const res = { body: await response.json() };
      if (!("body" in res)) {
        return;
      } else {
        const obs = res.body;
        const keeps: (keyof Obs)[] = ["type", "elems", "kjName"];
        const result: { [key: string]: Obs } = {};
        Object.keys(obs).forEach((key) => {
          if (obs[key] && typeof obs[key] === "object") {
            result[key] = {
              type: "",
              elems: "",
              kjName: "",
              pref: "",
              obsCode: key,
            };
            keeps.forEach((subKey) => {
              if (obs[key][subKey] !== undefined) {
                result[key][subKey] = obs[key][subKey];
              }
              const prefCode = parseInt(key.slice(0, 2));
              if (prefCode < 31) {
                result[key]["pref"] = "北海道";
              } else if (prefCode > 90) {
                result[key]["pref"] = "沖縄";
              } else {
                result[key]["pref"] = codePref[prefCode.toString()];
              }
            });
          }
        });
        setObsList(result);
      }
    };
    fetchData();
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
          <SinglePoint />
        ) : page === "multi" ? (
          <MultiPoint />
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
