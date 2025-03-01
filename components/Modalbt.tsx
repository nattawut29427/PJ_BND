import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@heroui/react";

  import FromUser from "@/app/admin/dashboard/Component/FormUesr";
  
  export default function MoDalbt() {
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
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                  <FromUser/>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }