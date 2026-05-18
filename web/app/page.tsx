import Link from 'next/link';
import { ChartLineUp, Database, Code, ArrowRight } from '@phosphor-icons/react/dist/ssr';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-background">
      {/* Background glow effects untuk kesan premium dan futuristik */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-8">
        
        {/* Badge Top */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
          <Code weight="duotone" className="w-4 h-4 text-primary" />
          <span>Technical Test Submission</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 pb-4 animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
          Trusmi Group
          <br />
          <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            Marketing Analytics
          </span>
        </h1>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          Platform analitik terpadu. Dilengkapi dengan <strong className="text-foreground font-medium">Visualisasi Dashboard</strong> untuk performa KPI dan fitur <strong className="text-foreground font-medium">Interactive Playground</strong> untuk menguji raw query PostgreSQL.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
          
          {/* Card 1: Dashboard (Soal 3 & 4) */}
          <Link href="/dashboard" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/15 to-white/5 hover:from-primary/50 hover:to-primary/10 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-background/80 backdrop-blur-xl p-8 rounded-2xl border border-white/5 flex flex-col items-start text-left transition-transform duration-500 group-hover:translate-y-[-2px]">
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-6 ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary/50 transition-all duration-500">
                <ChartLineUp weight="duotone" className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center justify-between w-full">
                KPI Dashboard
                <ArrowRight weight="bold" className="w-5 h-5 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Menjawab <strong>Soal 3 & 4</strong>. Visualisasi data pencapaian target dan analisis <em>Ontime/Late</em> menggunakan grafik interaktif yang indah dan responsif.
              </p>
            </div>
          </Link>

          {/* Card 2: Postgres Playground (Soal 1 & 2) */}
          <Link href="/playground" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/15 to-white/5 hover:from-blue-500/50 hover:to-blue-500/10 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-background/80 backdrop-blur-xl p-8 rounded-2xl border border-white/5 flex flex-col items-start text-left transition-transform duration-500 group-hover:translate-y-[-2px]">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 mb-6 ring-1 ring-blue-500/20 group-hover:bg-blue-500 group-hover:text-white group-hover:ring-blue-500/50 transition-all duration-500">
                <Database weight="duotone" className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center justify-between w-full">
                Postgres Playground
                <ArrowRight weight="bold" className="w-5 h-5 text-blue-400 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Menjawab <strong>Soal 1 & 2</strong>. Ruang interaktif bagi reviewer untuk mengeksekusi <em>raw query</em> SQL buatan saya langsung ke database yang terisolasi.
              </p>
            </div>
          </Link>
          
        </div>
      </div>
    </main>
  );
}
