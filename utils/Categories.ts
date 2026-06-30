import { IconType } from 'react-icons';
import {
  MdStorefront,
  MdOutlineCheckroom,
  MdOutlineWaves,
} from 'react-icons/md';
import {
  GiTrousers,
  GiSkirt,
  GiBackpack,
  GiHighHeel,
  GiNecklaceDisplay,
  GiLipstick,
} from 'react-icons/gi';
import { LiaTshirtSolid } from 'react-icons/lia';
import { TbShirt } from 'react-icons/tb';

import { PiSunglassesBold, PiBagBold, PiDressThin } from 'react-icons/pi';

export interface CategoryType {
  label: string;
  icon: IconType;
  image: string; // small square image used for the SHEIN-style circular thumbnail
}

export const categories: CategoryType[] = [
  {
    label: 'All',
    icon: MdStorefront,
    image: '/all.jpeg',
  },
  {
    label: 'Milestones',
    icon: PiDressThin,
    image: '/milestone.jpeg',
  },
  {
    label: 'Social Events',
    icon: LiaTshirtSolid,
    image: '/social.jpeg',
  },
  {
    label: 'Casuals',
    icon: GiTrousers,
    image: '/casual.jpeg',
  },
  {
    label: 'Corporates',
    icon: GiSkirt,
    image: '/corporate.jpeg',
  },
  {
    label: 'Daily Accessories',
    icon: TbShirt,
    image: '/access.jpeg',
  },
];
