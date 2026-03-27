// src/types/model-viewer.d.ts
// Add this file to your project root or types folder to extend JSX for model-viewer
// eslint-disable-next-line @typescript-eslint/no-namespace

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        ar?: boolean;
        loading?: 'lazy' | 'eager';
        style?: React.CSSProperties;
        poster?: string;
        shadowIntensity?: number;
        exposure?: number;
        cameraOrbit?: string;
        fieldOfView?: string;
        minCameraOrbit?: string;
        maxCameraOrbit?: string;
      };
    }
  }
}

export {};