import type { ThemeConfig } from 'antd';

export const pmsTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1E3A8A', // Deep Blue
    colorLink: '#2563EB',    // Brighter Blue for links
    colorSuccess: '#10B981', // Emerald green
    colorWarning: '#F59E0B', // Amber
    colorError: '#EF4444',   // Red
    colorBgLayout: '#F3F4F6',// Soft gray background for the app
    colorBgContainer: '#FFFFFF',
    borderRadius: 8,         // Softer corners
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      headerHeight: 64,
      headerPadding: '0 24px',
      siderBg: '#1E3A8A',
    },
    Menu: {
      darkItemBg: '#1E3A8A',
      darkItemSelectedBg: '#2563EB',
      darkItemColor: '#93C5FD', // Soft blue text for unselected
      darkItemHoverBg: '#1D4ED8',
      itemHeight: 48,
    },
    Card: {
      paddingLG: 24,
    },
    Button: {
      controlHeight: 40,
      fontWeight: 500,
    }
  },
};
