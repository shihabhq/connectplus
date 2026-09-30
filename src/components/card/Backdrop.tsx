/** Grid and two slow accent blobs behind the top of the card. Decorative only. */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[760px] overflow-hidden"
    >
      <div className="backdrop-grid absolute inset-0 [--grid-x:50%] @5xl:[--grid-x:28%]" />
      <div className="blob-a absolute -top-24 left-1/2 h-[380px] w-[380px] -translate-x-[85%] rounded-full bg-accent opacity-10 blur-[80px] @5xl:left-[calc(50%-260px)]" />
      <div className="blob-b absolute top-24 left-1/2 h-[320px] w-[320px] translate-x-[5%] rounded-full bg-accent opacity-[0.06] blur-[80px] @5xl:left-[calc(50%-420px)]" />
    </div>
  );
}
