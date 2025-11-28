// src/components/tailwind/TailwindTest.tsx
export default function TailwindTest() {
  return (
    <div className="min-h-[200px] rounded-xl border border-sky-500/50 bg-slate-900/60 p-6 text-sky-100 shadow-lg flex flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-bold text-sky-400">
        Tailwind ✅
      </h2>
      <p className="text-sm text-sky-200/80">
        这个组件在 <code>src/components/tailwind</code> 目录下，
        所以 Tailwind 会扫描并生成这些类。
      </p>
    </div>
  )
}
