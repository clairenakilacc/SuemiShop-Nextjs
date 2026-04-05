"use client";

import { useState, ComponentType } from "react";

interface ViewRowButtonProps {
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

export default function ViewRowButton({
  itemId,
  ModalComponent,
  onSuccess,
  buttonLabel = "View",
  buttonClassName = "btn btn-success",
}: ViewRowButtonProps) {
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
