"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/layout/screen-header";
import { useApp } from "@/lib/store/app-context";
import { compressPalmImage } from "@/lib/utils/compress-image";

export function UploadScreen() {
  const { setPalmImage, goTo } = useApp();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setLoading(true);
    try {
      const dataUrl = await compressPalmImage(file);
      setPalmImage(dataUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <button
        type="button"
        onClick={() => goTo("welcome")}
        className="mb-4 self-start text-sm text-[#8a7a4a]"
      >
        ← Назад
      </button>

      <ScreenHeader
        title="Загрузите ладонь"
        subtitle="Сделайте чёткое фото при хорошем освещении. Ладонь должна быть полностью видна."
      />

      <div className="my-6 rounded-2xl border border-[#c9a962]/15 bg-[#12100e]/60 p-4 text-[13px] leading-relaxed text-[#9a9288]">
        <p className="font-medium text-[#e8d5a3]">Как снять ладонь</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Дневной свет или включённая лампа</li>
          <li>Раскройте ладонь, разведите пальцы</li>
          <li>Пальцы вверх, ладонь на всю рамку</li>
          <li>Не кулак и не полузакрытая ладонь</li>
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 flex flex-1 flex-col items-center justify-center"
      >
        <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-dashed border-[#c9a962]/35 bg-[#12100e]/60">
          <div className="absolute inset-4 rounded-full border border-[#c9a962]/15" />
          <span className="font-display text-6xl text-[#c9a962]/40">✋</span>
        </div>
      </motion.div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex flex-col gap-3">
        <Button fullWidth disabled={loading} onClick={() => cameraRef.current?.click()}>
          <span className="flex items-center justify-center gap-2">
            <Camera size={20} />
            Сделать фото
          </span>
        </Button>
        <Button
          variant="secondary"
          fullWidth
          disabled={loading}
          onClick={() => galleryRef.current?.click()}
        >
          <span className="flex items-center justify-center gap-2">
            <ImageIcon size={20} />
            Выбрать из галереи
          </span>
        </Button>
      </div>
    </div>
  );
}
