import { createTheme } from "@mui/material";

const palette = {
  background: {
    paper: "#FFFFFF",
    default: "#477245",
  },
  common: {
    white: "#FFFFFF",
    black: "#000000",
  },
  grey: {
    50: "#FDFDFD",
    100: "#FBFBFB",
    200: "#F7F7F7",
    300: "#F0F0F0",
    400: "#EDEDED",
    500: "#DDDDDD",
    600: "#C2C2C2",
    700: "#B3B3B3",
    800: "#7A7A7A",
    900: "#333333",
  },
  divider: "#CCCCCC",
  error: {
    main: "#C00808",
  },
  info: {
    main: "#3393F2",
  },
  primary: {
    light: "#afceae",
    main: "#477245",
  },
  secondary: {
    main: "#6FB184",
  },
  success: {
    main: "#1AAA55",
  },
  warning: {
    main: "#F59600",
  },
  highlight: {
    drawer: "#477245",
    menu: {
      text: "#FDFDFD",
      textBackground: "#4D5F96",
      icon: "#F29E43",
      iconBackground: "#FFFFFF",
    },
  },
  tooltip: "#6FB184",
};

export default createTheme({
  components: {
    MuiBadge: {
      styleOverrides: {
        colorSecondary: {
          color: palette.common.black,
          backgroundColor: palette.common.white,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          fontWeight: 400,
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          width: "max-content",
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: palette.grey[600],
          // padding: 0,
        },
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        "html, body, #root": {
          height: "100%",
        },
        body: {
          fontFamily: `"Inter", sans-serif`,
          backgroundColor: palette.background.default,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.primary.main,
          color: palette.common.white,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: palette.grey[400],
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
        label: {
          marginLeft: "10px",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "12px",
          whiteSpace: "nowrap",
          fontWeight: "bold",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          boxSizing: "border-box",
          color: palette.primary.main,
          //   border: "1px solid palette.primary.main",
          borderRadius: "4px",
          //   ":hover": { background: "transparent" },
        },
        sizeSmall: {
          padding: 4,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "::placeholder": {
            color: palette.grey[700],
            opacity: 1,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          overflow: "hidden",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          color: palette.common.white,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          width: "auto",
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: "14px",
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: "wave",
        variant: "rounded",
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          marginLeft: "4px",
          marginRight: "4px",
          padding: "8px",
          textTransform: "none",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0",
          border: "0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `0.5px solid ${palette.divider}`,
          borderLeft: 0,
          borderRight: 0,
          padding: "4px 8px",
          whiteSpace: "nowrap",
          zIndex: 3,
          fontSize: "14px",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          flex: 1,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          border: 0,
          fontSize: "13px",
          fontWeight: "500",
          textTransform: "none",
          height: "42px",
          minHeight: "42px",
          maxHeight: "42px",

          ".MuiTableCell-root": {
            color: palette.common.white,
            backgroundColor: palette.primary.main,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: "42px",
          ":hover": {
            background: palette.grey[200],
          },
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: `${palette.common.white} !important`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette.tooltip,
          padding: "8px",
          fontSize: "14px",
        },
        arrow: {
          color: palette.tooltip,
        },
      },
      defaultProps: {
        disableInteractive: true,
        placement: "top",
        arrow: true,
      },
    },
  },
  palette,
  typography: {
    fontFamily: '"Inter", sans-serif',
    subtitle1: {
      fontSize: "18px",
      fontWeight: "600",
    },
    body1: {
      fontSize: "14px",
    },
    body2: {
      fontSize: "12px",
    },
    caption: {
      fontSize: "10px",
    },
  },
  zIndex: {
    appBar: 2,
    drawer: 1,
  },
});
