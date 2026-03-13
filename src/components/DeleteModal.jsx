// DeleteModal.js
import React from "react";
import { Button, Modal } from "antd";

const DeleteModal = ({
  isDeleteModal,
  showModalDelete,
  handleDelete,
  textheading,
  action,
  deleteTitle,
  deleteBtn,
}) => {
  return (
    <Modal
      open={isDeleteModal}
      onCancel={showModalDelete}
      footer={null}
      centered
    >
      <div>
        <div className="modal-title">
          <h3>{textheading}</h3>
        </div>

        <div className="delete-modal-body">
          <h6>
            Are you sure you want to {action} this{" "}
            <span>{deleteTitle}</span> permanently?
          </h6>
        </div>

        <div className="modal-footer p-4 flex justify-end gap-2">
          <Button onClick={showModalDelete}>Cancel</Button>
          <Button danger className="delete-btn" onClick={handleDelete}>
            {deleteBtn}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
