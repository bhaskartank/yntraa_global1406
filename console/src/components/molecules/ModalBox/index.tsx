import { Box, Button, IconButton, Modal, Slide, Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { IoMdClose as CloseIcon } from "react-icons/io";

interface ModalBoxProps {
  isOpen: boolean;
  closeDisabled?: boolean;
  closeBtnVariant?: string;
  confirmDisabled?: boolean;
  showCloseButton?: boolean;
  customStyle?: any;
  bodyStyle?: any;
  title?: string;
  resourceDetails?: React.ReactElement;
  hideHeader?: boolean;
  hideActions?: boolean;
  actions?: ReactNode | null;
  cancelBtnText?: string;
  confirmBtnText?: string;
  onCancel?: (param: any) => any | null;
  onConfirm?: (param: any) => any | null;
  children?: ReactNode;
}

const ModalBox: FC<ModalBoxProps> = ({
  isOpen,
  closeDisabled,
  closeBtnVariant = "outlined",
  confirmDisabled = false,
  showCloseButton = true,
  customStyle = {},
  bodyStyle = {},
  title = "",
  resourceDetails,
  hideHeader = false,
  hideActions = false,
  actions = null,
  cancelBtnText = "Close",
  confirmBtnText = "Create",
  onCancel,
  onConfirm,
  children,
}) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={!closeDisabled ? onCancel : () => null}
      closeAfterTransition
      disableAutoFocus={true}
      disableEscapeKeyDown={closeDisabled}>
      <Slide in={isOpen} direction="down">
        <Stack
          sx={{
            position: "absolute",
            top: "10%",
            left: 0,
            right: 0,
            mx: "auto",
            width: "max-content",
            maxWidth: "90%",
            maxHeight: "90%",
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            overflow: "hidden",
            ...customStyle,
          }}>
          {/* Modal Header */}
          {!hideHeader ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center" px={3} py={1} sx={{ backgroundColor: "info.lighter", color: "text.black" }}>
              <Typography noWrap fontWeight="600">
                {title}
              </Typography>

              {!closeDisabled && showCloseButton && (
                <IconButton aria-label="Close" onClick={onCancel} sx={{ ml: 2, p: 0, whiteSpace: "nowrap", "&:hover": { background: "transparent" } }}>
                  <CloseIcon size={20} />
                </IconButton>
              )}
            </Stack>
          ) : null}

          {/* Modal Body */}
          <Box flex={1}>
            {resourceDetails || null}

            <Box overflow="scroll" sx={{ overflow: "auto", p: !(hideHeader && hideActions) ? "16px 24px" : 0, ...bodyStyle }}>
              {children}
            </Box>
          </Box>

          {/* Modal Footer */}
          {!hideActions ? (
            <>
              <Stack direction="row" alignItems="center" px={3} py={1.5}>
                {actions ? (
                  <Stack flex="1">{actions}</Stack>
                ) : (
                  <Stack direction="row" alignItems="center" spacing={2} flex="1">
                    {onConfirm ? (
                      <Button variant="contained" color="primary" size="small" onClick={onConfirm} disabled={confirmDisabled}>
                        {confirmBtnText}
                      </Button>
                    ) : null}
                    {onCancel ? (
                      <Button variant={closeBtnVariant as any} color="primary" size="small" onClick={onCancel}>
                        {cancelBtnText}
                      </Button>
                    ) : null}
                  </Stack>
                )}
              </Stack>
            </>
          ) : null}
        </Stack>
      </Slide>
    </Modal>
  );
};

export default ModalBox;
