"use client";

import { AndroidInstallPrompt } from "./AndroidInstallPrompt";
import { IosInstallPrompt } from "./IosInstallPrompt";

export function PwaInstallPrompts() {
  return (
    <>
      <AndroidInstallPrompt />
      <IosInstallPrompt />
    </>
  );
}
