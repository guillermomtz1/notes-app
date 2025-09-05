import React from "react";
import ModalWrapper from "./ModalWrapper";
import AddEditNotes from "../../pages/Home/AddEditNotes";

const AddEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  type = "add", // "add" or "edit"
  noteData = null,
}) => {
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (noteData) => {
    const success = await onSubmit(noteData);
    if (success) {
      handleClose();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="w-[80%] max-w-xl mx-auto p-3 md:p-6 bg-surface rounded-lg overflow-hidden h-[500px]"
    >
      <AddEditNotes
        type={type}
        noteData={noteData}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
};

export default AddEditModal;
