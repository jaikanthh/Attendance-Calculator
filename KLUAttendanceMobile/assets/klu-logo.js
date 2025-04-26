import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

const logoXml = `<svg viewBox="0 0 160.24 64.65" xmlns="http://www.w3.org/2000/svg">
<path d="m56.73 0h15.35v18.47l23.25-18.47h26.98l-39.2 27.46 39.2 26.65h-28.07l-22.16-18.42v18.42h-15.35z" fill="#d03d42"/>
<path d="m106.75 12.1 15.56-10.75v38.19l37.93.05-10.97 14.52h-25.08l-17.44-11.69z" fill="#d03d42"/>
<path d="m56.73 1.51 10.89.33-10.89 6z" fill="#ab3438" fill-rule="evenodd"/>
<path d="m56.73 24.71 27.57 1.93-1.19.82 6.47 4.39-23.99-1.89-8.86 6.96z" fill="#ab3438"/>
<path d="m84.97 8.22 3.03 15.82 17.22-12.07 1.37-11.97h-11.28z" fill="#ab3438"/>
<path d="m106.75 15.36 15.56-2.53v24.39l-10.11 8.86-5.45-3.66z" fill="#ab3438"/>
<path d="m92.39 33.76-10.03 10.52 11.88 9.83h8.79l8.41-7.41z" fill="#ab3438"/>
<path d="m56.73 45.32 15.35 6.35v2.44h-15.35z" fill="#ab3438"/>
<path d="m142.28 39.57 17.96.02-10.97 14.52-12.48-.02z" fill="#ab3438"/>
</svg>`;

export const KLULogo = ({ width = 150, height = 50 }) => {
  return (
    <View style={{ width, height }}>
      <SvgXml 
        xml={logoXml} 
        width={width} 
        height={height} 
      />
    </View>
  );
}; 