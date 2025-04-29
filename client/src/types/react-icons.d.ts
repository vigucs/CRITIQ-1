import { IconType } from 'react-icons';

declare module 'react-icons' {
  import { ComponentType, SVGAttributes } from 'react';

  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
  }

  export type IconType = ComponentType<IconBaseProps>;

  export const FaStar: IconType;
  export const FaStarHalfAlt: IconType;
  export const FaRegStar: IconType;
  export const FaSearch: IconType;
  export const FaUser: IconType;
  export const FaSignOutAlt: IconType;
  export const FaSignInAlt: IconType;
  export const FaUserPlus: IconType;
  export const FaHome: IconType;
  export const FaFilm: IconType;
  export const FaComment: IconType;

  export { IconType };
} 