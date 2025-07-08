import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="p-4 sm:p-6 lg:p-8">
      {/* You can add a shared header, sidebar, or other layout elements here */}
      <main>{children}</main>
    </section>
  );
}
