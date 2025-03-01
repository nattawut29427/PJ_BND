// ในไฟล์ ModalEdit.tsx
"use client";

type Props = {
  email: string;
};

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@heroui/react";

import UpdateUser from "./UpdateUser";

export default function ModalEdit({ email }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Edit
      </Button>

      <Modal
        backdrop="blur"
        isDismissable={false}
        isOpen={isOpen}
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(_onClose) => (
            <>
              <ModalHeader>Update User</ModalHeader>
              <ModalBody>
                <UpdateUser email={email} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
