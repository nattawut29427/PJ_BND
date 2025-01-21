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
        <Button className="bg-red-600" onPress={onOpen}>Edit</Button>
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
                <ModalHeader className="flex flex-col gap-1">Update Product</ModalHeader>
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