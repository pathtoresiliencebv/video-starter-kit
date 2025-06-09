export interface ShortsTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
  is_premium: boolean;
  style_settings: {
    background: {
      type: 'solid' | 'gradient' | 'video';
      colors: string[];
      opacity?: number;
    };
    text: {
      font_family: string;
      font_size: number;
      font_weight: string;
      color: string;
      stroke?: {
        color: string;
        width: number;
      };
      shadow?: {
        color: string;
        blur: number;
        offset: { x: number; y: number };
      };
    };
    animation: {
      text_entrance: 'fade' | 'slide' | 'zoom' | 'typewriter';
      text_duration: number;
      transition_style: 'cut' | 'fade' | 'slide';
    };
    layout: {
      text_position: 'top' | 'center' | 'bottom';
      text_alignment: 'left' | 'center' | 'right';
      padding: number;
      max_width: number;
    };
  };
}

export const SHORTS_TEMPLATES: ShortsTemplate[] = [
  {
    id: 'educational',
    name: 'Educational',
    category: 'Learning',
    description: 'Clean, professional style perfect for educational content',
    preview_url: '/templates/educational-preview.jpg',
    is_premium: false,
    style_settings: {
      background: {
        type: 'solid',
        colors: ['#1a1a1a'],
      },
      text: {
        font_family: 'Inter',
        font_size: 32,
        font_weight: '600',
        color: '#ffffff',
        stroke: {
          color: '#000000',
          width: 2,
        },
      },
      animation: {
        text_entrance: 'fade',
        text_duration: 3000,
        transition_style: 'fade',
      },
      layout: {
        text_position: 'center',
        text_alignment: 'center',
        padding: 40,
        max_width: 80,
      },
    },
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    category: 'Fun',
    description: 'Dynamic and colorful style for entertaining content',
    preview_url: '/templates/entertainment-preview.jpg',
    is_premium: false,
    style_settings: {
      background: {
        type: 'gradient',
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
      },
      text: {
        font_family: 'Poppins',
        font_size: 36,
        font_weight: '700',
        color: '#ffffff',
        stroke: {
          color: '#000000',
          width: 3,
        },
        shadow: {
          color: '#000000',
          blur: 8,
          offset: { x: 2, y: 2 },
        },
      },
      animation: {
        text_entrance: 'zoom',
        text_duration: 2500,
        transition_style: 'slide',
      },
      layout: {
        text_position: 'center',
        text_alignment: 'center',
        padding: 30,
        max_width: 85,
      },
    },
  },
  {
    id: 'news',
    name: 'News & Facts',
    category: 'Information',
    description: 'Professional news-style layout for factual content',
    preview_url: '/templates/news-preview.jpg',
    is_premium: false,
    style_settings: {
      background: {
        type: 'solid',
        colors: ['#0f172a'],
      },
      text: {
        font_family: 'Roboto',
        font_size: 28,
        font_weight: '500',
        color: '#f1f5f9',
        stroke: {
          color: '#1e293b',
          width: 1,
        },
      },
      animation: {
        text_entrance: 'slide',
        text_duration: 3500,
        transition_style: 'cut',
      },
      layout: {
        text_position: 'bottom',
        text_alignment: 'left',
        padding: 50,
        max_width: 90,
      },
    },
  },
  {
    id: 'motivational',
    name: 'Motivational',
    category: 'Inspiration',
    description: 'Inspiring gradient backgrounds with bold typography',
    preview_url: '/templates/motivational-preview.jpg',
    is_premium: false,
    style_settings: {
      background: {
        type: 'gradient',
        colors: ['#667eea', '#764ba2', '#f093fb'],
      },
      text: {
        font_family: 'Montserrat',
        font_size: 34,
        font_weight: '800',
        color: '#ffffff',
        stroke: {
          color: '#000000',
          width: 2,
        },
        shadow: {
          color: '#000000',
          blur: 12,
          offset: { x: 3, y: 3 },
        },
      },
      animation: {
        text_entrance: 'typewriter',
        text_duration: 4000,
        transition_style: 'fade',
      },
      layout: {
        text_position: 'center',
        text_alignment: 'center',
        padding: 35,
        max_width: 75,
      },
    },
  },
  {
    id: 'trendy',
    name: 'Trendy',
    category: 'Social',
    description: 'Modern social media style with vibrant colors',
    preview_url: '/templates/trendy-preview.jpg',
    is_premium: false,
    style_settings: {
      background: {
        type: 'gradient',
        colors: ['#ff9a9e', '#fecfef', '#fecfef'],
      },
      text: {
        font_family: 'Nunito',
        font_size: 38,
        font_weight: '900',
        color: '#2d3748',
        stroke: {
          color: '#ffffff',
          width: 4,
        },
        shadow: {
          color: '#ffffff',
          blur: 6,
          offset: { x: 1, y: 1 },
        },
      },
      animation: {
        text_entrance: 'zoom',
        text_duration: 2000,
        transition_style: 'slide',
      },
      layout: {
        text_position: 'top',
        text_alignment: 'center',
        padding: 25,
        max_width: 90,
      },
    },
  },
];

export function getTemplateById(id: string): ShortsTemplate | undefined {
  return SHORTS_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): ShortsTemplate[] {
  return SHORTS_TEMPLATES.filter(template => template.category === category);
}

export function getFreeTemplates(): ShortsTemplate[] {
  return SHORTS_TEMPLATES.filter(template => !template.is_premium);
}

export function getPremiumTemplates(): ShortsTemplate[] {
  return SHORTS_TEMPLATES.filter(template => template.is_premium);
}
