export type ThemeType = {
    COLORS: {
      PRIMARY: string;
      SECONDARY: string;
      TEXT_ON_PRIMARY: string;
      BACKGROUND: string;
      TEXT: string;
    },
    FONT_SIZES: {
        SMALL: string,
        MEDIUM: string,
        LARGE: string,
    };
  };

export const lightTheme: ThemeType = {
    COLORS: {
      PRIMARY: '#007AFF',  
      SECONDARY: '#FF9500', 
      TEXT: '#333333',
      TEXT_ON_PRIMARY: '#FFFFFF',      
      BACKGROUND: '#FFFFFF',
    },
    FONT_SIZES: {
      SMALL: '12px',
      MEDIUM: '16px',
      LARGE: '20px',
    },
  };
  
  export const darkTheme: ThemeType = {
    COLORS: {
      PRIMARY: '#0A84FF',    
      SECONDARY: '#FFCC00',  
      TEXT: '#FFFFFF',
      TEXT_ON_PRIMARY: '#FFFFFF',       
      BACKGROUND: '#000000',
    },
    FONT_SIZES: {
      SMALL: '12px',
      MEDIUM: '16px',
      LARGE: '20px',
    },
  };