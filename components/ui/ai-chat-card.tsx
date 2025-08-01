"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";

export function AIChatCard() {
  return (
    <CardSpotlight 
      className="h-auto w-full p-6"
      color="#10b981"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 className="text-xl font-bold text-white relative z-20">
          AI智能对话
        </h3>
      </div>
      
      <div className="text-neutral-200 relative z-20">
        <ul className="space-y-3">
          <FeatureItem title="与AI助手自然对话交流" />
          <FeatureItem title="咨询游戏相关问题和建议" />
          <FeatureItem title="获取个性化游戏攻略指导" />
          <FeatureItem title="实时响应，流畅对话体验" />
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
      className="h-4 w-4 text-green-400 mt-0.5 shrink-0"
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