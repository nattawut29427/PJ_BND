import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@heroui/react";

  import FormUser from "@/app/admin/dashboard/Component/FormUesr";
  
  export default function modalUs() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
    return (
      <>
        <Button className="bg-blue-600" onPress={onOpen}>Add</Button>
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="5xl"
          backdrop="blur"
        >
          <ModalContent className="">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Add User</ModalHeader>
                <ModalBody>
                  <FormUser/>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }