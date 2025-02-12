"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useDraggable,
  Input,
} from "@heroui/react";

interface DeleteProductModalProps {
  productId: number; // ใช้ productId แทน productName
  productName: string;
  onProductDeleted?: () => void;
}

export default function DeleteProductModal({
  productId,
  productName,
  onProductDeleted,
}: DeleteProductModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const targetRef = React.useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`/api/productService?id=${productId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
  
      onProductDeleted?.();
      onOpenChange(false);
    } catch (err) {
      setError("Error deleting product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <Button color="danger" onPress={onOpen}>
        Delete
      </Button>

      <Modal ref={targetRef} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <form onSubmit={handleDelete}>
            <ModalHeader {...moveProps} className="flex flex-col gap-1">
              Confirm Deletion
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete product <strong>{productName}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                Type <strong>{productName}</strong> to confirm.
              </p>
              <Input
                placeholder="Enter product name to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
              {error && <p className="text-red-500">{error}</p>}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => onOpenChange(false)}
                isDisabled={loading}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={loading}>
                Confirm
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
