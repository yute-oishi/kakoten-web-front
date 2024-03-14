import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import left_arrow from "../assets/left_arrow.svg";
import right_arrow from "../assets/right_arrow.svg";
import ja from "date-fns/locale/ja";
import { addDays } from "@/modules/dateUtils";

interface Props {
  initialDate?: Date;
  handleChangeDate?: (newDate: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  style?: React.CSSProperties;
  props?: DatePickerProps<Date>;
}

/**
 * 右左矢印付きの日付選択ボックス
 * @param disableDates 選択不可とする日付の配列
 * @param initialDate 入力されている日付の初期値
 */
const DatePickerWithArrows = ({
  initialDate,
  props,
  handleChangeDate = () => {},
  style = {},
  minDate,
  maxDate,
}: Props) => {
  const [date, setDate] = React.useState<Date | undefined>(
    initialDate !== undefined ? initialDate : undefined
  );
  const buttonDisabled = props?.disabled === true;

  React.useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  const [open, setOpen] = React.useState(false);

  const handleLeftClick = (date: Date) => {
    if (date !== undefined) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 1);
      if (judgeDisableDay(newDate) === false) {
        handleChangeDate(newDate);
        setDate(newDate);
      }
    }
  };

  const handleRightClick = (date: Date) => {
    if (date !== undefined) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      if (judgeDisableDay(newDate) === false) {
        handleChangeDate(newDate);
        setDate(newDate);
      }
    }
  };

  // trueの場合disableとなる
  const judgeDisableDay = (date: Date) => {
    if (maxDate !== undefined && minDate !== undefined) {
      return date > maxDate || date < minDate;
    }
    if (maxDate !== undefined) {
      return date > maxDate;
    }
    if (minDate !== undefined) {
      return date < minDate;
    }
    return true;
  };

  return (
    <Box
      sx={{
        border: "solid 1px #AAAAAA",
        borderRadius: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      style={style}
    >
      <IconButton
        disabled={buttonDisabled || judgeDisableDay(addDays(date as Date, -1))}
        data-testid="date-control-left-arrow"
        sx={{ ml: "8px", height: "80%", alignItems: "center" }}
        onClick={() => {
          if (date !== undefined) {
            handleLeftClick(date);
          }
        }}
      >
        <img src={left_arrow} />
      </IconButton>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        <DatePicker
          shouldDisableDate={judgeDisableDay}
          onChange={(date: Date | null) => {
            if (date) {
              handleChangeDate(date);
            }
          }}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          slots={{
            openPickerButton: () => <div></div>,
          }}
          slotProps={{
            popper: {
              style: { translate: "-30px -10px" },
            },
            desktopPaper: {
              style: { borderRadius: "20px" },
            },
            openPickerButton: { style: { visibility: "hidden" } },
            textField: {
              sx: {
                display: "flex",
                justifyContent: "center",
                width: "100%",
                "& fieldset": {
                  border: "none",
                },
                "& .MuiOutlinedInput-root": {
                  cursor: "pointer",
                },
              },
              inputProps: {
                style: {
                  textAlign: "center",
                  color: "blue",
                  fontSize: style.fontSize,
                },
                readOnly: true,
                sx: { cursor: "pointer" },
              },
              onClick: () => {
                setOpen(true);
              },
            },
          }}
          value={date !== undefined ? date : null}
          format="yyyy MM dd"
          {...props}
        />
      </LocalizationProvider>

      <IconButton
        disabled={buttonDisabled || judgeDisableDay(addDays(date as Date, 1))}
        data-testid="date-control-right-arrow"
        sx={{ mr: "8px", height: "80%", alignItems: "center" }}
        onClick={() => {
          if (date !== undefined) {
            handleRightClick(date);
          }
        }}
      >
        <img src={right_arrow} />
      </IconButton>
    </Box>
  );
};

export default DatePickerWithArrows;
