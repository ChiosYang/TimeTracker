"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";

export function AIRecommendationCard() {
  return (
    <CardSpotlight 
      className="h-auto w-full p-6"
      color="#3b82f6"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <h3 className="text-xl font-bold text-white relative z-20">
          AI游戏推荐引擎
        </h3>
      </div>
      
      <div className="text-neutral-200 relative z-20">
        <ul className="space-y-3">
          <FeatureItem title="分析游戏时长最高的5款游戏偏好" />
          <FeatureItem title="识别游戏类型和风格偏好模式" />
          <FeatureItem title="推荐库中被忽略的优质游戏" />
          <FeatureItem title="提供详细的推荐理由和置信度" />
        </ul>
      </div>
    </CardSpotlight>
  );
}

const FeatureItem = ({ title }: { title: string }) => {
  return (
    <li className="flex gap-2 items-start">
      <CheckIcon />
      <p className="text-neutral-200 text-sm">{title}</p>
    </li>
  );
};

const CheckIcon = () => {
  return (
    <svg
      className="h-4 w-4 text-blue-400 mt-0.5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
};