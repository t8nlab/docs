import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from "next/image"
import { GithubStars } from '@/app/components/github-stars';

import { RiDiscordFill } from "@remixicon/react";
import UserMenu from '@/app/components/UserMenu';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <Image src={"/favicon.ico"} alt='Titan Planet Logo' height={32} width={32} className='object-cover' />
      ),
    },
    links: [
      {
        text: "Documentation",
        url: "/docs",
        active: "nested-url"
      },

      {
        text: "Benchmark",
        url: "/benchmark",
        active: "nested-url"
      },
      {
        text: "Observatory",
        url: "/observatory/download",
        active: "nested-url"
      },
      {
        text: "Market",
        url: "/extensions",
        active: "nested-url"
      },
      {
        text: "Changelog",
        url: "/changelog",
        active: "nested-url"
      },
      {
        text: <GithubStars />,
        url: "https://github.com/ezet-galaxy/titanpl",
        active: "nested-url"
      },
    ]
  };
}
