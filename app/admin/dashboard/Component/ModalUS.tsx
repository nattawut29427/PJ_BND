import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    useDisclosure,
  } from "@heroui/react";

  import FormUser from "@/app/admin/dashboard/Component/FormUesr";
  
  export default function ModalUs() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
    return (
      <>
        <Button className="bg-blue-600" onPress={onOpen}>Add</Button>
        <Modal
          backdrop="blur"
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          size="5xl"
          onOpenChange={onOpenChange}
          >
          <ModalContent className="">
            {(_onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Add User</ModalHeader>
                <ModalBody>
                  <FormUser/>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }