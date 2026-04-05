"use client";

import { useState, ComponentType } from "react";

interface EditRowButtonProps {
  itemId: string;
  ModalComponent: ComponentType<{
    isOpen: boolean;
    onClose: () => void;
    itemId: string;
    onSuccess?: () => void;
  }>;
  onSuccess?: () => void;
  buttonLabel?: string;
  buttonClassName?: string;
}

export default function EditRowButton({
  itemId,
  ModalComponent,
  onSuccess,
  buttonLabel = "Edit",
  buttonClassName = "btn btn-warning",
}: EditRowButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={buttonClassName} onClick={() => setOpen(true)}>
        {buttonLabel}
      </button>
      <ModalComponent
        isOpen={open}
        onClose={() => setOpen(false)}
        itemId={itemId}
        onSuccess={onSuccess}
      />
    </>
  );
}
