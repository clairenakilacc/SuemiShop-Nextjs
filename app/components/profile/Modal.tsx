// components/modals/Modal.tsx

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
      }}
    >
      <div
        className="card shadow-lg border-0 w-100 mx-3"
        style={{ maxWidth: "600px", borderRadius: "8px" }}
      >
        {/* Header na may Line (Border Bottom) */}
        <div className="card-header bg-grey d-flex justify-content-between align-items-center border-bottom py-3 px-4">
          <h5
            className="mb-0 fw-medium text-dark"
            style={{ fontSize: "1.2rem" }}
          >
            {title}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
            style={{ fontSize: "0.8rem" }}
          ></button>
        </div>

        {/* Body Part */}
        <div className="card-body p-4">{children}</div>
      </div>
    </div>
  );
}
