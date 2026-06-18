import { describe, it, expect } from 'vitest';
import { UI_TRANSLATIONS } from '../translations';

describe('UI Translations consistency', () => {
  it('should have matching translation keys for en and pl', () => {
    expect(UI_TRANSLATIONS).toHaveProperty('en');
    expect(UI_TRANSLATIONS).toHaveProperty('pl');

    const enKeys = Object.keys(UI_TRANSLATIONS.en);
    const plKeys = Object.keys(UI_TRANSLATIONS.pl);

    // Assert that the number of keys matches
    expect(enKeys.length).toBe(plKeys.length);

    // Verify all English keys exist in Polish translations
    enKeys.forEach((key) => {
      expect(UI_TRANSLATIONS.pl).toHaveProperty(key);
      expect(UI_TRANSLATIONS.pl[key as keyof typeof UI_TRANSLATIONS.pl]).toBeDefined();
    });

    // Verify all Polish keys exist in English translations
    plKeys.forEach((key) => {
      expect(UI_TRANSLATIONS.en).toHaveProperty(key);
      expect(UI_TRANSLATIONS.en[key as keyof typeof UI_TRANSLATIONS.en]).toBeDefined();
    });
  });
});
