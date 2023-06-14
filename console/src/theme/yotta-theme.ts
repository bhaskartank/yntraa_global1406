import { createTheme } from "@mui/material";

const palette = {
  background: {
    paper: "#FFFFFF",
    default: "#283E81",
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
    light: "#EAECF2",
    main: "#283E81",
  },
  secondary: {
    main: "#F29F43",
    contrastText: "#FFFFFF",
  },
  success: {
    main: "#1AAA55",
  },
  warning: {
    main: "#F59600",
    contrastText: "#FFFFFF",
  },
  highlight: {
    drawer: "#283E81",
    menu: {
      text: "#FDFDFD",
      textBackground: "#4D5F96",
      icon: "#F29E43",
      iconBackground: "#FFFFFF",
    },
  },
  tooltip: "#4D5F96",
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
      defaultProps: {
        size: "medium",
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          width: "max-content",
          boxShadow: "none !important",
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          border: "1px solid",
          borderColor: palette.grey[500],
          borderRadius: "8px",
          boxShadow: "none",
          ":hover": { boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: palette.grey[600],
          padding: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-colorDefault": {
            backgroundColor: palette.primary.light,
          },
        },
      },
      defaultProps: {
        size: "small",
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        body: {
          backgroundColor: palette.background.default,
        },
        "html, body, #root": {
          height: "100%",
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
          fontSize: "14px",
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
      defaultProps: {
        size: "medium",
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
          ":first-child": {
            paddingLeft: "24px",
          },
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
          background: palette.grey[200],
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
      lineHeight: 1,
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
