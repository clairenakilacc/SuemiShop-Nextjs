"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ROUTES } from "../routes";
import Loader from "../components/Loader";

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
  const [userName, setUserName] = useState<string>("");
  const [roleName, setRoleName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Define menu roles
  const MENU_ROLES = {
    itemsSection: ["Superadmin", "Admin"],
    categories: ["Superadmin"],
    inventories: ["Superadmin"],
    usersSection: ["Superadmin", "Manager"],
    payslipsSection: ["Superadmin", "Manager"],
    attendance: ["Superadmin"],

    settings: ["Superadmin"],
  };

  const canAccess = (roles: string[]) => roles.includes(roleName);

  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      let user: any = null;
      const stored = localStorage.getItem("user");

      if (stored) {
        user = JSON.parse(stored);
        if (!user.role) {
          const res = await fetch("/api/me");
          const data = await res.json();
          if (data.user) {
            user = data.user;
            localStorage.setItem("user", JSON.stringify(user));
          }
        }
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
      setRoleName(user.role?.name || "");
    };

    fetchUser();
  }, [router]);

  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const toggleUsersMenu = () => setUsersMenuOpen((prev) => !prev);
  const toggleItemsMenu = () => setItemsMenuOpen((prev) => !prev);
  const togglePayslipsMenu = () => setPayslipsMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push(ROUTES.HOME);
  };

  const handleNavClick = (path: string) => {
    setLoading(true);
    router.push(path);
  };

  if (!mounted) return null;

  return (
    <div className="d-flex vh-100 w-100" style={{ overflow: "hidden" }}>
      {loading && <Loader />}

      {/* Sidebar */}
      <nav
        className="bg-dark text-white d-flex flex-column p-3"
        style={{
          width: collapsed ? "60px" : "220px",
          transition: "width 0.3s ease",
        }}
      >
        {/* Toggle button */}
        <div
          className={`w-100 d-flex ${
            collapsed ? "justify-content-center" : "justify-content-end"
          } mb-3`}
        >
          <button
            className="btn btn-outline-light btn-sm"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        {/* Logo */}
        {!collapsed && (
          <div className="mb-4 w-100 d-flex justify-content-center">
            <Link href={ROUTES.HOME}>
              <img
                src="/images/logo2.png"
                alt="Logo"
                className="img-fluid"
                style={{ maxWidth: "120px", cursor: "pointer" }}
              />
            </Link>
          </div>
        )}

        <ul className="nav nav-pills flex-column grow">
          {/* Dashboard */}
          <li className="nav-item mb-2">
            <button
              className={`nav-link text-white d-flex align-items-center btn btn-dark w-100 ${
                collapsed ? "justify-content-center" : "text-start"
              }`}
              onClick={() => handleNavClick("/suemishop/dashboard")}
            >
              <i className="bi bi-speedometer2"></i>
              {!collapsed && <span className="ms-2">Dashboard</span>}
            </button>
          </li>

          {/* Items Section */}
          {canAccess(MENU_ROLES.itemsSection) && (
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center btn btn-dark w-100 ${
                  collapsed
                    ? "justify-content-center"
                    : "justify-content-between"
                }`}
                onClick={toggleItemsMenu}
              >
                <span className="d-flex align-items-center">
                  <i className="bi bi-handbag"></i>
                  {!collapsed && <span className="ms-2">Items</span>}
                </span>
                {!collapsed && (
                  <i
                    className={`bi ${
                      itemsMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                  ></i>
                )}
              </button>

              {itemsMenuOpen && !collapsed && (
                <ul className="nav flex-column ms-3 mt-2">
                  {canAccess(MENU_ROLES.categories) && (
                    <li className="nav-item mb-1">
                      <button
                        className="nav-link text-white btn btn-dark text-start w-100"
                        onClick={() => handleNavClick("/suemishop/categories")}
                      >
                        Categories
                      </button>
                    </li>
                  )}

                  <li className="nav-item mb-1">
                    <button
                      className="nav-link text-white btn btn-dark text-start w-100"
                      onClick={() => handleNavClick("/suemishop/items")}
                    >
                      Sold Items
                    </button>
                  </li>

                  {canAccess(MENU_ROLES.inventories) && (
                    <li className="nav-item mb-1">
                      <button
                        className="nav-link text-white btn btn-dark text-start w-100"
                        onClick={() => handleNavClick("/suemishop/inventories")}
                      >
                        Inventories
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}

          {/* Users Section */}
          {canAccess(MENU_ROLES.usersSection) && (
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center btn btn-dark w-100 ${
                  collapsed
                    ? "justify-content-center"
                    : "justify-content-between"
                }`}
                onClick={toggleUsersMenu}
              >
                <span className="d-flex align-items-center">
                  <i className="bi bi-people"></i>
                  {!collapsed && <span className="ms-2">Users</span>}
                </span>
                {!collapsed && (
                  <i
                    className={`bi ${
                      usersMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                  ></i>
                )}
              </button>

              {usersMenuOpen && !collapsed && (
                <ul className="nav flex-column ms-3 mt-2">
                  <li className="nav-item mb-1">
                    <button
                      className="nav-link text-white btn btn-dark text-start w-100"
                      onClick={() => handleNavClick("/suemishop/employees")}
                    >
                      Users
                    </button>
                  </li>
                  <li className="nav-item mb-1">
                    <button
                      className="nav-link text-white btn btn-dark text-start w-100"
                      onClick={() => handleNavClick("/suemishop/suppliers")}
                    >
                      Suppliers
                    </button>
                  </li>
                  <li className="nav-item mb-1">
                    <button
                      className="nav-link text-white btn btn-dark text-start w-100"
                      onClick={() => handleNavClick("/suemishop/roles")}
                    >
                      Roles
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Payslips Section */}
          {canAccess(MENU_ROLES.payslipsSection) && (
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center btn btn-dark w-100 ${
                  collapsed
                    ? "justify-content-center"
                    : "justify-content-between"
                }`}
                onClick={togglePayslipsMenu}
              >
                <span className="d-flex align-items-center">
                  <i className="bi bi-credit-card-2-front"></i>
                  {!collapsed && <span className="ms-2">Payroll</span>}
                </span>
                {!collapsed && (
                  <i
                    className={`bi ${
                      payslipsMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                  ></i>
                )}
              </button>

              {payslipsMenuOpen && !collapsed && (
                <ul className="nav flex-column ms-3 mt-2">
                  {canAccess(MENU_ROLES.payslipsSection) && (
                    <li className="nav-item mb-1">
                      <button
                        className="nav-link text-white btn btn-dark text-start w-100"
                        onClick={() => handleNavClick("/suemishop/payslips")}
                      >
                        Payslips
                      </button>
                    </li>
                  )}

                  {canAccess(MENU_ROLES.attendance) && (
                    <li className="nav-item mb-1">
                      <button
                        className="nav-link text-white btn btn-dark text-start w-100"
                        onClick={() => handleNavClick("/suemishop/attendance")}
                      >
                        Attendance
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}

          {/* Expenses */}
          {canAccess(MENU_ROLES.settings) && (
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center btn btn-dark w-100 ${
                  collapsed ? "justify-content-center" : "text-start"
                }`}
                onClick={() => handleNavClick("/suemishop/expenses")}
              >
                <i className="bi bi-gear"></i>
                {!collapsed && <span className="ms-2">Expenses</span>}
              </button>
            </li>
          )}

          {/* Settings */}
          {canAccess(MENU_ROLES.settings) && (
            <li className="nav-item mb-2">
              <button
                className={`nav-link text-white d-flex align-items-center btn btn-dark w-100 ${
                  collapsed ? "justify-content-center" : "text-start"
                }`}
                onClick={() => handleNavClick("/suemishop/settings")}
              >
                <i className="bi bi-gear"></i>
                {!collapsed && <span className="ms-2">Settings</span>}
              </button>
            </li>
          )}

          {/* Profile */}
          <li className="nav-item mb-2">
            <button
              className={`nav-link text-white d-flex align-items-center btn btn-dark w-100 ${
                collapsed ? "justify-content-center" : "text-start"
              }`}
              onClick={() => handleNavClick("/suemishop/profile")}
            >
              <i className="bi bi-person-check"></i>
              {!collapsed && <span className="ms-2">Profile</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="d-flex flex-column grow vh-100 overflow-hidden">
        <header className="bg-light border-bottom p-3 d-flex justify-content-between align-items-center shrink-0">
          {/* <span className="fw-semibold text-secondary">
            {userName || "Loading..."}
            {roleName ? ` - ${roleName}` : ""}
          </span> */}
          <h2
            style={{
              fontFamily: "cursive",
              textShadow: "2px 2px 4px rgba(255, 182, 193, 0.8)",
              color: "#FF69B4", // optional pink color
            }}
          >
            SuemiShop
          </h2>
          <button
            className="btn btn-outline-secondary btn-sm btn-pink-hover"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <main className="grow p-4 overflow-auto">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}
