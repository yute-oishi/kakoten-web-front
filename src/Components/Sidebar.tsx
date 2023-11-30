import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import React from "react";
import logoIcon from "@/assets/logo.svg";
import pinIcon from "@/assets/pin.svg";
import pinsIcon from "@/assets/pins.svg";
import alertIcon from "@/assets/alert.svg";
import rightIcon from "@/assets/right.svg";
import homeIcon from "@/assets/home.svg";

import "./Sidebar.css";
import SelectObs from "@/Pages/SelectObs";
import { useRecoilState } from "recoil";
import { Obs, Page } from "../modules/types";
import { multiPageState, pageState, singlePageState } from "@/modules/atoms";
import SelectMultiObs from "@/Pages/SelectMultiObs";
import useMedia from "@/hooks/useMedia";
import { getYesterday } from "@/modules/dateUtils";

function Sidebar() {
  const [sideBarIsOpen, setSideBarIsOpen] = React.useState<boolean>(false);
  const [_, setPage] = useRecoilState<Page>(pageState);
  const [__, setSinglePageObs] = useRecoilState<Obs>(singlePageState);
  const [___, setMultiPageObs] = useRecoilState<[Obs, Date][]>(multiPageState);
  const [singleModalOpen, setSingleModalOpen] = React.useState<boolean>(false);
  const [multiModalOpen, setMultiModalOpen] = React.useState<boolean>(false);
  const isSmallScreen = useMedia("(max-width: 600px)");

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setSideBarIsOpen(open);
    };

  const list = () => (
    <Box
      className="sideBar"
      sx={{ width: isSmallScreen ? 200 : 250 }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <img
        src={logoIcon}
        style={{
          width: "150px",
          float: "right",
          marginRight: 10,
          paddingTop: 8,
          paddingBottom: 24,
        }}
      />
      <List>
        <ListItem sx={{ mb: 3 }} disablePadding>
          <ListItemButton
            onClick={() => {
              setSideBarIsOpen(false);
              setPage("main");
            }}
          >
            <ListItemIcon>
              <img style={{ width: isSmallScreen ? 25 : 35 }} src={homeIcon} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                fontSize: isSmallScreen ? 14 : 16,
              }}
              primary="トップページ"
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setSingleModalOpen(true);
            }}
          >
            <ListItemIcon>
              <img style={{ width: isSmallScreen ? 25 : 35 }} src={pinIcon} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                fontSize: isSmallScreen ? 14 : 16,
              }}
              primary="単一地点を見る"
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setMultiModalOpen(true);
            }}
          >
            <ListItemIcon>
              <img style={{ width: isSmallScreen ? 25 : 35 }} src={pinsIcon} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                fontSize: isSmallScreen ? 14 : 16,
              }}
              primary="複数地点を比較"
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <img style={{ width: isSmallScreen ? 25 : 35 }} src={alertIcon} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                fontSize: isSmallScreen ? 14 : 16,
              }}
              primary="ご利用に際して"
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <SelectObs
        open={singleModalOpen}
        setOpen={setSingleModalOpen}
        setObs={(obs: Obs) => {
          setSinglePageObs(obs);
          setSideBarIsOpen(false);
          setSingleModalOpen(false);
          setPage("single");
        }}
      />
      <SelectMultiObs
        open={multiModalOpen}
        setOpen={setMultiModalOpen}
        handleFinish={(obss: Obs[]) => {
          setMultiPageObs(obss.map((obs) => [obs, getYesterday()]));
          setSideBarIsOpen(false);
          setMultiModalOpen(false);
          setPage("multi");
        }}
      />
      <React.Fragment>
        <IconButton
          sx={{ position: "fixed", top: 12, left: 12 }}
          onClick={toggleDrawer(true)}
        >
          <img className="open-button" src={rightIcon} />
        </IconButton>
        <SwipeableDrawer
          anchor="left"
          open={sideBarIsOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          {list()}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}

export default Sidebar;
