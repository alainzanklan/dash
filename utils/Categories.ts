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
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop',
  },
  {
    label: 'Milestones',
    icon: PiDressThin,
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop',
  },
  {
    label: 'Social Events',
    icon: LiaTshirtSolid,
    image:
      'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=200&h=200&fit=crop',
  },
  {
    label: 'Casuals',
    icon: GiTrousers,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=200&fit=crop',
  },
  {
    label: 'Corporates',
    icon: GiSkirt,
    image:
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=200&h=200&fit=crop',
  },
  {
    label: 'Daily Accessories',
    icon: TbShirt,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop',
  },
];
