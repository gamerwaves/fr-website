import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const name = url.searchParams.get('name') ?? '';
  const email = (url.searchParams.get('email') ?? '').trim().toLowerCase();

  if (!email) {
    return {
      status: 400,
      error: 'Email is required'
    };
  }

  const target = `https://gamerwaves.fillout.com/t/fdpSiULLozus?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
  throw redirect(302, target);
};
