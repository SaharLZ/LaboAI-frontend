"use client";
import { usePathname, useRouter } from "next/navigation";
import "../style.css"; 

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { path: "/", label: "Skin Cancer Classifier" },
    { path: "/BreastCancer", label: "Breast Cancer Detector" },
    { path: "/LungCancer", label: "Lung Cancer Detector" },
  ];

  return (
    <aside className="sidebar">
      <h2>LaboAI</h2>
      {links.map((link) => (
        <button
          key={link.path}
          onClick={() => router.push(link.path)}
          className={`model-button ${pathname === link.path ? "active" : ""}`}
        >
          {link.label}
        </button>
      ))}
      <footer>Made with ❤️ SMETS</footer>
    </aside>
  );
}
