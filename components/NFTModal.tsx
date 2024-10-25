'use client';

import { useState } from "react";
import { Modal } from "antd";
import Button from "./Button";

const NFTModal: React.FC = () => {
const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button onClick={showModal}>
        Choose NFT
      </Button>
      <Modal
        open={isModalOpen}
      onCancel={handleCancel}
    >
      NFTModal
      </Modal>
    </div>
  )
}

export default NFTModal;