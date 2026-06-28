import { useState, useRef, useEffect } from "react";
import useTheme from "../hooks/useTheme";
import { Laptop, Moon, Sun, Palette } from "lucide-react";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="theme-toggle-dropdown" ref={menuRef} style={{ position: "relative" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontWeight: 500, fontSize: "14px", padding: 0 }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <Palette size={16} /> Theme
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: "16px",
          background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)",
          padding: "8px", display: "flex", flexDirection: "column", gap: "4px",
          minWidth: "130px", zIndex: 1000
        }}>
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => { setTheme(option.value); setIsOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px",
                background: theme === option.value ? "var(--bg-primary)" : "transparent",
                border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
                color: theme === option.value ? "var(--text-primary)" : "var(--text-secondary)",
                textAlign: "left", width: "100%", fontSize: "14px", fontWeight: theme === option.value ? 600 : 500
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
              onMouseOut={(e) => e.currentTarget.style.background = theme === option.value ? 'var(--bg-primary)' : 'transparent'}
            >
              <option.icon size={15} />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
