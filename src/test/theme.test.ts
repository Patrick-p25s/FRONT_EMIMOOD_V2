import { describe, it, expect } from 'vitest';
import { resolveTheme } from '@/components/emimood/theme';
describe('Thèmes demandés',()=>{
 it('conserve le thème clair indépendamment du système',()=>{expect(resolveTheme('light',true)).toBe('light')});
 it('conserve le thème sombre indépendamment du système',()=>{expect(resolveTheme('dark',false)).toBe('dark')});
 it('suit le système quand la préférence système est choisie',()=>{expect(resolveTheme('system',true)).toBe('dark');expect(resolveTheme('system',false)).toBe('light')});
});
