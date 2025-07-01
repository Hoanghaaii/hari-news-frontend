export default function Footer() {
  return (
    <footer className="w-full border-t bg-white/80 py-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Hari News. Liên hệ: <a href="mailto:support@harinews.com" className="underline">support@harinews.com</a>
    </footer>
  );
} 