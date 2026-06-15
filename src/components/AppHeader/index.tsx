import {
  Grow,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../api/services/User/store";
import AvatarMenu from "../AvatarMenu";

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User;
  pageTitle: string;
}

const typoStyle = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  lineHeight: 1,
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  height: theme.tokens.header.height,
}));

const AppHeader = React.forwardRef<HTMLDivElement, AppHeaderProps>(
  (props: AppHeaderProps, ref) => {
    const { user, pageTitle } = props;
    const { t, i18n } = useTranslation("app");
    const theme = useTheme();

    const [count, setCount] = useState(3600);

    useEffect(() => {
      const id = setInterval(() => {
        setCount((current) => {
          if (current === 0) return 0;
          return current - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }, []);

    const formatUnit = (time: number): string => {
      return String(time).padStart(2, "0");
    };

    const formatCountdown = () => {
      const minutes = Math.floor(count / 60);
      const seconds = count % 60;
      return `${formatUnit(minutes)}:${formatUnit(seconds)}`;
    };

    const handleLanguageChange = (event: SelectChangeEvent) => {
      i18n.changeLanguage(event.target.value);
    };

    return (
      <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
        <Toolbar sx={{ background: "#08140C 0% 0% no-repeat padding-box" }}>
          <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
            <Box>
              <Typography variant="h6" component="div" color="primary">
                {formatCountdown()}
              </Typography>
            </Box>
            <Box sx={{ width: 20, height: 20, flex: 1 }} />
            <Box sx={{ flex: 2 }}>
              <Typography
                sx={{
                  ...typoStyle,
                  color: theme.palette.primary.main,
                  mb: theme.spacing(0.5),
                }}
                variant="h6"
                component="div"
              >
                {t("appTitle").toLocaleUpperCase()}
              </Typography>
              <Typography
                sx={{ ...typoStyle }}
                variant="overline"
                component="div"
                noWrap
              >
                {pageTitle.toLocaleUpperCase()}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Select
                size="small"
                value={i18n.resolvedLanguage || i18n.language}
                onChange={handleLanguageChange}
                sx={{
                  color: theme.palette.common.white,
                  mr: 2,
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                  ".MuiSvgIcon-root": {
                    color: theme.palette.common.white,
                  },
                }}
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="de">DE</MenuItem>
              </Select>
              {user && user.eMail && (
                <Grow in={Boolean(user && user.eMail)}>
                  <AvatarMenu user={user} />
                </Grow>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    );
  },
);

export default AppHeader;
