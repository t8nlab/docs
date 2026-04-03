import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import Notice from '../components/Notice';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <HomeLayout {...baseOptions()}>
      <Notice title='TitanPl v7.0.3 is Live — Stable ready to land on Titan Planet' variant='success'>
        <p className='opacity-90'>
          ⚡ <strong>Stable ready to land on Titan Planet:</strong>
          <Link href='/docs/how-to-use/09-production' className='ml-2 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-400/30 underline-offset-4'>
            View Deploy Documentation &rarr;
          </Link>
        </p>
      </Notice>
      {children}
    </HomeLayout>
  );
}
