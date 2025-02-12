"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, useDraggable, Input } from "@heroui/react";

interface DeleteUserModalProps {
    email: string;
    onUserDeleted?: () => void;
  }
export default function DeleteUserModal({ email, onUserDeleted }: DeleteUserModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const targetRef = React.useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // ป้องกันหน้ารีโหลด
    setLoading(true);
    setError(null);

    if (confirmText !== email) {
      setError("Email does not match. Please type correctly.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users?email=${email}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      onUserDeleted?.(); // Notify parent component that user was deleted
      onOpenChange(false); // ปิด Modal
    } catch (err) {
      setError("Error deleting user. Please try again.");
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
                Are you sure you want to delete user <strong>{email}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                Type <strong>{email}</strong> to confirm.
              </p>
              <Input
                placeholder="Enter email to confirm"
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
