import dynamic from 'next/dynamic';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

const DynamicRoutes = dynamic(
	() => import('../common/components/templates/Routes/Routes'),
	{
		ssr: false,
	},
);
const Index: NextPage = () => <DynamicRoutes />;

export default Index;

export const getServerSideProps: GetServerSideProps = async (
	context,
) => {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/auth/sign-in',
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
};
