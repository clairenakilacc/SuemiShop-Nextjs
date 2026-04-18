"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ROUTES } from "../routes";
import LoadingOverlay from "../components/LoadingOverlay";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [usersMenuOpen, setUsersMenuOpen] = useState(false);
  const [itemsMenuOpen, setItemsMenuOpen] = useState(false);
  const [payslipsMenuOpen, setPayslipsMenuOpen] = useState(false);

  const [userName, setUserName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // ✅ ROLE MAP (fix for role_id)
  const ROLE_MAP: Record<number, string> = {
    1: "Superadmin",
    2: "Admin",
    3: "Manager",
  };

  const MENU_ROLES = {
    itemsSection: ["Superadmin", "Admin"],
    usersSection: ["Superadmin", "Manager"],
    payslipsSection: ["Superadmin", "Manager"],
  };

  const canAccess = (roles: string[]) => roles.includes(roleName);

  // ----------------------------
  // LOAD USER
  // ----------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let user: any = null;
        const stored = localStorage.getItem("user");

        if (stored) {
          user = JSON.parse(stored);
        } else {
          const res = await fetch("/api/me");
          const data = await res.json();

          if (data.user) {
            user = data.user;
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            router.push(ROUTES.HOME);
            return;
          }
        }

        setUserName(user.name || "Unknown User");

        // ✅ FIX ROLE
        setRoleName(ROLE_MAP[user.role_id] || "");
      } catch (err) {
        console.error("User fetch error:", err);
        router.push(ROUTES.HOME);
      } finally {
        setMounted(true);
      }
    };

    fetchUser();
  }, [router]);

  // ----------------------------
  // ROUTE CHANGE LOADING
  // ----------------------------
  useEffect(() => {
    if (!mounted) return;

    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 150); // small delay for smooth UX

    return () => clearTimeout(timeout);
  }, [pathname, mounted]);

  if (!mounted) return null;

  const sidebarWidth = collapsed ? "70px" : "230px";

  const handleNavClick = (path: string) => {
    if (path === pathname) return; // prevent unnecessary reload
    setLoading(true);
    router.push(path);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push(ROUTES.HOME);
  };

  return (
    <div
      className="d-flex vh-100 w-100"
      style={
        {
          overflow: "hidden",
          "--sidebar-width": sidebarWidth,
        } as React.CSSProperties
      }
    >
      {/* LOADING */}
      {loading && <LoadingOverlay />}

      {/* SIDEBAR */}
      <nav
        className="bg-dark text-white d-flex flex-column"
        style={{
          width: "var(--sidebar-width)",
          height: "100vh",
          flexShrink: 0,
          overflowY: "auto",
          overflowX: "hidden",
          transition: "width 0.3s ease",
        }}
      >
        <div className="p-3">
          <div
            className={`d-flex ${
              collapsed ? "justify-content-center" : "justify-content-end"
            } mb-3`}
          >
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setCollapsed((p) => !p)}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>

          {!collapsed && (
            <div className="d-flex justify-content-center mb-3">
              <Link href={ROUTES.HOME}>
                <img
                  src="/images/logo2.png"
                  alt="Logo"
                  style={{ maxWidth: "120px" }}
                />
              </Link>
            </div>
          )}
        </div>

        {/* MENU */}
        <ul className="nav nav-pills flex-column px-2 pb-3">
          {/* DASHBOARD */}
          <li className="nav-item mb-2">
            <button
              className={`nav-link text-white btn btn-dark w-100 d-flex align-items-center ${
                collapsed ? "justify-content-center" : ""
              }`}
              onClick={() => handleNavClick("/suemishop/dashboard")}
            >
              <i className="bi bi-speedometer2"></i>
              {!collapsed && <span className="ms-2">Dashboard</span>}
            </button>
          </li>

          {/* ITEMS */}
          {roleName && canAccess(MENU_ROLES.itemsSection) && (
            <li className="nav-item mb-2">
              <button
                className="nav-link text-white btn btn-dark w-100 d-flex justify-content-between"
                onClick={() => setItemsMenuOpen((p) => !p)}
              >
                <span>
                  <i className="bi bi-handbag"></i>
                  {!collapsed && <span className="ms-2">Items</span>}
                </span>

                {!collapsed && (
                  <i
                    className={`bi ${
                      itemsMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                  />
                )}
              </button>

              {itemsMenuOpen && !collapsed && (
                <ul className="nav flex-column ms-3 mt-2">
                  <li>
                    <button
                      className="nav-link text-white btn btn-dark w-100 text-start"
                      onClick={() => handleNavClick("/suemishop/categories")}
                    >
                      Categories
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link text-white btn btn-dark w-100 text-start"
                      onClick={() => handleNavClick("/suemishop/items")}
                    >
                      Sold Items
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link text-white btn btn-dark w-100 text-start"
                      onClick={() => handleNavClick("/suemishop/inventories")}
                    >
                      Inventories
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* USERS */}
          {roleName && canAccess(MENU_ROLES.usersSection) && (
            <li className="nav-item mb-2">
              <button
                className="nav-link text-white btn btn-dark w-100 d-flex justify-content-between"
                onClick={() => setUsersMenuOpen((p) => !p)}
              >
                <span>
                  <i className="bi bi-people"></i>
                  {!collapsed && <span className="ms-2">Users</span>}
                </span>

                {!collapsed && (
                  <i
                    className={`bi ${
                      usersMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                  />
                )}
              </button>

              {usersMenuOpen && !collapsed && (
                <ul className="nav flex-column ms-3 mt-2">
                  <li>
                    <button
                      className="nav-link text-white btn btn-dark w-100 text-start"
                      onClick={() => handleNavClick("/suemishop/employees")}
                    >
                      Users
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link text-white btn btn-dark w-100 text-start"
                      onClick={() => handleNavClick("/suemishop/suppliers")}
                    >
                      Suppliers
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link text-white btn btn-dark w-100 text-start"
                      onClick={() => handleNavClick("/suemishop/roles")}
                    >
                      Roles
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* PAYROLL */}
          {roleName && canAccess(MENU_ROLES.payslipsSection) && (
            <li className="nav-item mb-2">
              <button
                className="nav-link text-white btn btn-dark w-100 d-flex justify-content-between"
                onClick={() => setPayslipsMenuOpen((p) => !p)}
              >
                <span>
                  <i className="bi bi-credit-card-2-front"></i>
                  {!collapsed && <span className="ms-2">Payroll</span>}
                </span>

                {!collapsed && (
                  <i
                    className={`bi ${
                      payslipsMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                  />
                )}
              </button>

              {payslipsMenuOpen && !collapsed && (
                <ul className="nav flex-column ms-3 mt-2">
                  <li>
                    <button
                      className="nav-link text-white btn btn-dark w-100 text-start"
                      onClick={() => handleNavClick("/suemishop/payslips")}
                    >
                      Payslips
                    </button>
                  </li>
                  <li>
                    <button
                      className="nav-link text-white btn btn-dark w-100 text-start"
                      onClick={() => handleNavClick("/suemishop/attendance")}
                    >
                      Attendance
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* EXPENSES */}
          <li className="nav-item mb-2">
            <button
              className="nav-link text-white btn btn-dark w-100 d-flex align-items-center"
              onClick={() => handleNavClick("/suemishop/expenses")}
            >
              <i className="bi bi-gear"></i>
              {!collapsed && <span className="ms-2">Expenses</span>}
            </button>
          </li>

          {/* PROFILE */}
          <li className="nav-item mb-2">
            <button
              className="nav-link text-white btn btn-dark w-100 d-flex align-items-center"
              onClick={() => handleNavClick("/suemishop/profile")}
            >
              <i className="bi bi-person-check"></i>
              {!collapsed && <span className="ms-2">Profile</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* MAIN */}
      <div
        className="d-flex flex-column vh-100"
        style={{
          width: "calc(100% - var(--sidebar-width))",
          overflow: "hidden",
        }}
      >
        <header className="bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
          <span className="fw-semibold text-secondary">Hi, {userName}</span>

          <button className="btn btn-logout btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="grow p-4 overflow-auto">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}
