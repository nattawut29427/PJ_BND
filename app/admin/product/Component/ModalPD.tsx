import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@nextui-org/react";

  import FromPoduct from "@/app/admin/product/Component/FormPoduct";
  
  export default function modalbt() {
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
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                  <FromPoduct/>
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