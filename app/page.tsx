import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className=""
          src="/nigaoe_spinoza.png"
          alt="logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex items-center">
          <div className="text-4xl font-bold">欢迎张总莅临考察！</div>
        </div>
       
      </main>
    </div>
  );
}
