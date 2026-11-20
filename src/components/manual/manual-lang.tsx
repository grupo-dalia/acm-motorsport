"use client";

import { createContext, useContext } from "react";
import { manualUi, type ManualLang } from "@/content/manual-ui";

export const LangCtx = createContext<ManualLang>("es");
/** Textos de la interfaz en el idioma del manual. */
export const useManualUi = () => manualUi[useContext(LangCtx)];
