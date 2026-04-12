export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e293b_0%,transparent_55%),radial-gradient(circle_at_bottom,#172554_0%,transparent_42%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.98)_0%,rgba(15,23,42,0.95)_48%,rgba(30,41,59,0.92)_100%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}