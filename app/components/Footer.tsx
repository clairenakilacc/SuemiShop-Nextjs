export default function Footer() {
  return (
    <footer
      className="text-black text-center p-4 mt-auto"
      style={{ backgroundColor: "#FFAEBB" }}
    >
      &copy; {new Date().getFullYear()} Suemi Online Shop. All rights reserved.
    </footer>
  );
}
