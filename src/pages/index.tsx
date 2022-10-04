import dynamic from 'next/dynamic';
import { NextPage } from 'next';

const DynamicRoutes = dynamic(
	() => import('../components/templates/Routes/Routes'),
	{
		ssr: false,
	},
);
const Index: NextPage = () => <DynamicRoutes />;

export default Index;
