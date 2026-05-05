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
      <Notice title='TitanPl v7.0.4 is Live — Task new gravity runtime api' variant='success'>
        <p className='opacity-90'>
          ⚡ <strong>Mange your backgroud tasks with ease</strong>
          <Link href='/docs/how-to-use/05-runtime-apis#task-managed-background-tasks' className='ml-2 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-400/30 underline-offset-4'>
            View Task Documentation
          </Link>
        </p>
      </Notice>
      {children}
    </HomeLayout>
  );
}
