import "./globals.css";
import Sidebar from "../components/Sidebar"; // หรือ "../components/Sidebar" ก็ได้

export const metadata = {
  title: "PonyCFX",
  description: "A cute and powerful calculator suite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex"> {/* ใช้ flexbox เพื่อจัดวาง */}
          <Sidebar />
          <main className="flex-1 p-8 ml-64"> {/* ml-64 คือการเว้นที่สำหรับ Sidebar */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}