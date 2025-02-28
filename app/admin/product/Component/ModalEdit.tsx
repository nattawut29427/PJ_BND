import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import UpdateProduct from "@/app/admin/product/Component/UpdateProduct";

type Props = {
  id: number;
};

export default function ModalBt({ id }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpen = () => {
    setSelectedId(id); // ใช้ ID จาก props โดยตรง
    onOpen();
  };

  return (
    <>
      <Button 
        color="primary"
        onPress={handleOpen} // ไม่ต้องส่งพารามิเตอร์
      >
        Edit
      </Button>
      
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Product
              </ModalHeader>
              <ModalBody>
                {selectedId !== null && (
                  <UpdateProduct id={selectedId} />
                )}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}