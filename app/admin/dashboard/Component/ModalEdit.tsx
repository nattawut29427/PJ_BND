// ในไฟล์ ModalEdit.tsx
"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import UpdateUser from "./UpdateUser";

type Props = {
  email: string; // รับค่า email เป็น string
};

export default function ModalEdit({ email }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button 
        color="primary"
        onPress={onOpen}
      >
        Edit
      </Button>
      
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        backdrop="blur"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
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