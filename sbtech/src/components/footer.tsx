export function Footer() {
  return (
    <footer className="border-t py-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-4">© {new Date().getFullYear()} SB Tech Associates. All rights reserved.</div>
    </footer>
  );
}