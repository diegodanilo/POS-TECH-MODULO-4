export type ScreenType =
    'desktop' | 'tablet' | 'mobile'

export function checkScreenSize(screenWidth: number): ScreenType {
   if (screenWidth < 560) return 'mobile';
   else if (screenWidth < 1024) return 'tablet';
   else return 'desktop';
}