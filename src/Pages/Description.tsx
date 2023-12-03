import { Box, Button, Grid } from "@mui/material";
import "./Description.css";
import { MainStartButtonSx } from "@/modules/styles";
import { useRecoilState } from "recoil";
import { isSidebarOpenState } from "@/modules/atoms";
import FeedIn from "@/Components/FeedIn";

const Description = () => {
  const [_, setSideBarIsOpen] = useRecoilState<boolean>(isSidebarOpenState);

  return (
    <Box className="rounded-font" sx={{ px: 1 }}>
      <Box sx={{ width: "95%" }}>
        <h1>{"　"}過去の天気を</h1>
        <h1>{"　　"}かんたんグラフ化</h1>
      </Box>
      <Box className="examples">
        <Box sx={{ color: "black", fontWeight: "bold" }}>
          完全無料で過去の気候データを調べるサービスです。
        </Box>
        <Box>{"　"}・過去の特定日の気象データを可視化したい。</Box>
        <Box>{"　"}・太陽光、風力等の発電量の要因分析をしたい。</Box>
        <Box>{"　"}・電気代が高かった日の気候の影響を調べたい。</Box>
        <Box>{"　"}・想い出のあの日あの場所がどんな気候だったか。</Box>
        <Box sx={{ color: "black", fontWeight: "bold" }}>
          こんなときにご利用いただけます！
        </Box>
      </Box>
      <Grid container spacing={5} sx={{ display: "flex", p: 3 }}>
        <Grid item xs={12} lg={6}>
          <FeedIn>
            <h2>シンプルな操作で過去の気象データをグラフ化</h2>
            <img width={"100%"} src="single.png" />
          </FeedIn>
        </Grid>
        <Grid item xs={12} lg={5.9}>
          <FeedIn>
            <h2>複数の地点や日付と比較をする本格的分析まで</h2>
            <img width={"100%"} src="multi.png" />
          </FeedIn>
        </Grid>

        <Grid item xs={12} lg={6}>
          <FeedIn>
            <h2>全国約1200地点から履歴機能や検索機能でかんたんに探せる</h2>
            <img width={"100%"} src="search.png" />
          </FeedIn>
        </Grid>
        <Grid item xs={12} lg={6}>
          <FeedIn>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2>スマートフォン・タブレット・ＰＣ、全サイズ対応！</h2>
              <Box>
                <img width="330px" src="smartphone.png" />
              </Box>
            </Box>
          </FeedIn>
        </Grid>
      </Grid>
      <FeedIn marginRoot="0px">
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <Button
            onClick={() => {
              setSideBarIsOpen(true);
            }}
            sx={MainStartButtonSx}
          >
            今すぐ始める
          </Button>
        </Box>
      </FeedIn>
    </Box>
  );
};

export default Description;
