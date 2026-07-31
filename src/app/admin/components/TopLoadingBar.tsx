export default function TopLoadingBar() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 z-50 overflow-hidden pointer-events-none">
      <div className="h-full bg-blue-600 w-1/2 rounded-full absolute top-0 animate-loadingBar" />
    </div>
  );
}
