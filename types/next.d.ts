// Type declarations for Next.js modules

import { FC, ComponentProps, ReactElement, ReactNode } from 'react';

declare module 'next/font/google' {
  interface FontOptions {
    subsets?: string[];
    weight?: string[];
    variable?: string;
  }
  
  export function Poppins(options: FontOptions): {
    className: string;
    variable: string;
    style: { fontFamily: string };
  };
  
  export function Outfit(options: FontOptions): {
    className: string;
    variable: string;
    style: { fontFamily: string };
  };
}

declare module 'next/script' {
  export interface ScriptProps extends ComponentProps<'script'> {
    id?: string;
    strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
    onLoad?: () => void;
    onError?: () => void;
    onReady?: () => void;
    dangerouslySetInnerHTML?: {
      __html: string;
    };
  }
  const Script: FC<ScriptProps>;
  export default Script;
}

declare module 'next/link' {
  export interface LinkProps extends Omit<ComponentProps<'a'>, 'href'> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    children?: ReactNode;
  }
  const Link: FC<LinkProps>;
  export default Link;
}

declare module 'next/navigation' {
  export function redirect(url: string): never;
}

declare module 'next' {
  export interface Metadata {
    title?: string | null;
    description?: string | null;
    generator?: string | null;
    applicationName?: string | null;
    referrer?: 'no-referrer' | 'origin-when-cross-origin' | 'origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' | null;
    keywords?: Array<string> | string | null;
    authors?: Array<{ name: string; url?: string }> | null;
    creator?: string | null;
    publisher?: string | null;
    formatDetection?: {
      email?: boolean | null;
      address?: boolean | null;
      telephone?: boolean | null;
    } | null;
    metadataBase?: URL | null;
    alternates?: {
      canonical?: string | null;
      languages?: Record<string, string> | null;
      media?: Record<string, string> | null;
      types?: Record<string, string> | null;
    } | null;
    openGraph?: {
      title?: string | null;
      description?: string | null;
      url?: string | null;
      siteName?: string | null;
      images?: Array<{
        url: string;
        width?: number | null;
        height?: number | null;
        alt?: string | null;
      }> | null;
      locale?: string | null;
      type?: string | null;
    } | null;
    robots?: {
      index?: boolean | null;
      follow?: boolean | null;
      googleBot?: {
        index?: boolean | null;
        follow?: boolean | null;
        'max-image-preview'?: string | null;
        'max-video-preview'?: number | null;
        'max-snippet'?: number | null;
      } | null;
    } | null;
    twitter?: {
      card?: 'summary' | 'summary_large_image' | 'app' | 'player' | null;
      title?: string | null;
      description?: string | null;
      images?: string[] | string | null;
    } | null;
    verification?: {
      google?: string | null;
      yahoo?: string | null;
      yandex?: string | null;
      bing?: string | null;
    } | null;
    icons?: {
      icon?: string | string[] | null;
      shortcut?: string | null;
      apple?: string | null;
      other?: Array<{
        rel: string;
        url: string;
        type?: string | null;
        sizes?: string | null;
      }> | null;
    } | null;
  }

  export namespace MetadataRoute {
    export interface Robots {
      rules: {
        userAgent?: string | string[];
        allow?: string | string[];
        disallow?: string | string[];
        crawlDelay?: number;
      };
      sitemap?: string;
      host?: string;
    }

    export type Sitemap = Array<{
      url: string;
      lastModified?: string | Date;
      changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority?: number;
    }>;
  }
} 