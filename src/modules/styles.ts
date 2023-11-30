import { SxProps, Theme } from "@mui/material";

export const focusedButtonSx: SxProps<Theme> = {
  textTransform: "none",
  borderRadius: 5,
  px: 1.5,
  m: 0.5,
  height: 30,
  color: "#FFFFFF",
  backgroundColor: "#446de3",
  border: "1px solid #377ce4",
  "&:hover": {
    backgroundColor: "#4484e4",
  },
  "&:active": {
    backgroundColor: "#377ce4",
  },
  ":disabled": {
    border: "1px solid #BCBCBC",
    backgroundColor: "#CDCDCD",
    color: "#999999",
  },
};

export const normalButtonSx: SxProps<Theme> = { m: 0.5, height: 30, px: 1.6 };

export const transparentButtonSx: SxProps<Theme> = {
  ...focusedButtonSx,
  color: "#555555",
  backgroundColor: "#00000000",
  "&:hover": {
    backgroundColor: "#bac4e3",
  },
  "&:active": {
    backgroundColor: "#bac4e3",
  },
};

export const decideButtonSx: SxProps<Theme> = {
  textTransform: "none",
  borderRadius: 2,
  color: "#FFFFFF",
  backgroundColor: "#446de3",
  border: "1px solid #377ce4",
  height: 32,
  "&:hover": {
    backgroundColor: "#4484e4",
  },
  "&:active": {
    backgroundColor: "#377ce4",
  },
};

export const selectedObsSx: SxProps<Theme> = {
  textAlign: "center",
  justifyItems: "center",
  alignItems: "center",
  px: 2,
  mx: 0.5,
  pt: 0.3,
  pb: 0.6,
  my: "auto",
  borderRadius: 5,
  color: "#FFFFFF",
  backgroundColor: "#446de3",
  border: "1px solid #377ce4",
};

export const buttonColors = [
  "#0043c9", // blue
  "#3686ff", // lightblue
  "#94df42", // green
  "#417505", // lightgreen
  "#ed001d", // red
  "#9013fe", // purple
  "#f5a623", // orange
  "#e939e5", // pink
];
