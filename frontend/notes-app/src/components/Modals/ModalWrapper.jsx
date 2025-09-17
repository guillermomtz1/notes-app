import React from "react";
import Modal from "react-modal";

const ModalWrapper = ({
  isOpen,
  onRequestClose,
  children,
  className = "",
  contentLabel = "",
  ...props
}) => {
  const defaultOverlayStyle = {
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: defaultOverlayStyle,
      }}
      contentLabel={contentLabel}
      className={`${className} [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-surface [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full`}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default ModalWrapper;
