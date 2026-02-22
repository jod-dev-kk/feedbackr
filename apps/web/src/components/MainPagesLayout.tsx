const MainPagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white w-full h-full shadow-sm ring ring-neutral-300 rounded-sm overflow-y-auto [&_div[data-content='main']]:px-6 [&_div[data-content='main']]:py-4">
      <main>{children}</main>
    </div>
  );
};

export default MainPagesLayout;
