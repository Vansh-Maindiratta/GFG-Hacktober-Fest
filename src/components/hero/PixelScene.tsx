export function PixelScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 top-0 h-screen overflow-hidden select-none"
      style={{ zIndex: 0 }}
    >
      <img
        src="/main_ui_bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      <div className="absolute inset-0 bg-[#050B14]/55" />
    </div>
  );
}