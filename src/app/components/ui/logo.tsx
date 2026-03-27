import logo from "../ui/Logo.png";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Image */}
      <div style={{ width: '80px' }}>
        <img 
          src={logo}
          alt="Money Bag Logo"
        />
      </div>
    </div>
  );
}