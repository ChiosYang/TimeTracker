"use client"

import { BlurFade } from "@/components/magicui/blur-fade"

export function AnimatedHeroSection() {
  return (
    <>
      <BlurFade delay={0} duration={0.6} direction="up" inView>
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          KAIOSEI
        </h1>
      </BlurFade>
      <BlurFade delay={0.2} duration={0.6} direction="up" inView>
        <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          AI驱动的Steam游戏推荐与管理工具，让你发现游戏库中的隐藏宝藏
        </p>
      </BlurFade>
    </>
  )
}