"use client";

interface Category {
  id: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
}

interface Props {
  show: boolean;
  category: Category | null;
  onClose: () => void;
}

export default function ViewCategory({ show, category, onClose }: Props) {
  if (!show || !category) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">View Category</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="table-responsive">
              <table className="table mb-0 view-table">
                <tbody>
                  {/* SECTION HEADER (GLOBAL STYLE) */}
                  <tr className="view-section-header">
                    <th colSpan={2}>Category Information</th>
                  </tr>

                  <tr>
                    <th>Description</th>
                    <td className="text-capitalize">{category.description}</td>
                  </tr>

                  <tr>
                    <th>Created At</th>
                    <td>
                      {category.created_at
                        ? new Date(category.created_at).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <th>Updated At</th>
                    <td>
                      {category.updated_at
                        ? new Date(category.updated_at).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
