import { Box, Button, Grid, TextField } from "@mui/material";
import useMedia from "@/hooks/useMedia";
import React from "react";
import { useRecoilState } from "recoil";
import { Page } from "../modules/types";
import { pageState } from "@/modules/atoms";
import ReCAPTCHA, { ReCAPTCHAProps } from "react-google-recaptcha";
import { focusedButtonSx } from "@/modules/styles";

const Notion = () => {
  const isSmallScreen = useMedia("(max-width: 600px)");
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isVerified, setIsVerified] = React.useState<boolean>(false);
  const [page] = useRecoilState<Page>(pageState);

  React.useEffect(() => {
    setName("");
    setEmail("");
    setMessage("");
    setIsVerified(false);
    setErrors([]);
  }, [page]);

  const handleSubmit = () => {
    setErrors([]);
    const errors = [];
    const emailRegex = /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;
    if (name === "") {
      errors.push("お名前を記入して下さい。");
    }
    if (name.length > 16) {
      errors.push("お名前は16文字以内で記入して下さい。");
    }
    if (!emailRegex.test(email)) {
      errors.push("正しいメールアドレスか確認して下さい。");
    }
    if (email === "") {
      errors.push("メールアドレスを記入して下さい。");
    }
    if (email.length > 50) {
      errors.push("メールアドレスは40文字以内で記入して下さい。");
    }
    if (message === "") {
      errors.push("お問い合わせ内容を記入して下さい。");
    }
    if (message.length > 300) {
      errors.push("お問い合わせ内容は300文字以内で記入して下さい。");
    }
    if (errors.length === 0) {
      setErrors(["お問い合わせを送信しました。"]);
    } else {
      setErrors(errors);
    }
  };
  return (
    <Box sx={{ px: isSmallScreen ? 2 : 10 }}>
      <h2>本サービスについて</h2>
      <Grid container>
        <Grid item xs={12} md={10} lg={8}>
          <ul>
            <li>サービス内容</li>
            <Box sx={{ mb: 2 }}>
              本サービスは全国各地点の過去のデータを閲覧し、複数の日付や地点と比較ができる完全無償のサービスです。
              利用可能なデータは、本サービスがデータの取込みを開始した2023年11月15日からとなります。
            </Box>
            <li>商用利用の禁止</li>
            <Box sx={{ mb: 2 }}>
              本サービスで得た情報の商用利用は、有償・無償を問わずに禁止しています。
            </Box>
            <li>データソースについて</li>
            <Box sx={{ mb: 2 }}>
              本サービスの気象データは気象庁のアメダス観測データを元に作成しています。
              細かい補正方法等により気象庁が公開しているデータと誤差が生じていることもありますのでご了承ください。
            </Box>
            <li>損害について</li>
            <Box sx={{ mb: 2 }}>
              本サービスのデータ提供により生じた損害はデータの整合性の有無にかかわらず保障できません。
            </Box>
            <li>データ更新のタイミング</li>
            <Box sx={{ mb: 2 }}>
              毎日、午前4時～6時頃に全国の1日前の気象データが取込まれ、閲覧可能になります。
            </Box>
            <li>全体のアクセス制限</li>
            <Box sx={{ mb: 2 }}>
              無償のサービスを継続して提供するため、本サービスの1日のデータ通信量の限度をユーザ全体の合計で定めています。
              ユーザ全体からのアクセス量が限度を超えると、アクセスに規制がかかることがあります。
              アクセス規制は翌日の朝9時にリセットされますので、時間をおいてから再度ご利用ください。
            </Box>
            <li>個人のアクセス制限</li>
            <Box sx={{ mb: 2 }}>
              悪意のあるアクセスであると判断した場合、個人ユーザを対象にIPアドレス規制等の措置を講じることがあります。
            </Box>
            <li>お問い合わせ</li>
            <Box sx={{ mb: 2 }}>
              本サービスについてお問い合わせがありましたら、下記のフォームを記入の上、送信をして下さい。
            </Box>
          </ul>
        </Grid>
      </Grid>
      <Box sx={{ maxWidth: "700px", mx: isSmallScreen ? 2 : 5 }}>
        <TextField
          label="お名前"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          label="メールアドレス"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          label="お問い合わせ内容"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", m: 1 }}>
          <Box>
            {errors.map((e, index) => (
              <Box key={index} sx={{ color: "red" }}>
                {e}
              </Box>
            ))}
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={(e: string | null) => {
                if (e !== null) {
                  setIsVerified(true);
                }
              }}
            />
          </Box>
          <Button
            disabled={!isVerified}
            variant="contained"
            color="primary"
            sx={{ ...focusedButtonSx, width: "100px", height: "50px" }}
            onClick={handleSubmit}
          >
            送信
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Notion;
