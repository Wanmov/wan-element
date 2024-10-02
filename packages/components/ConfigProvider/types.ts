import type { Language, TranslatePair } from "@wan-element/locale";

export interface ConfigProviderProps {
  locale?: Language;
  extendsI18nMsg?: TranslatePair;
}
