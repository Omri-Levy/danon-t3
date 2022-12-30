import { NextPage } from 'next';
import { useRouter } from 'next/router';

export const Error: NextPage = () => {
	const { query } = useRouter();

	if (query.error === 'Configuration') {
		return (
			<div className='hero min-h-full '>
				<div className='hero-content flex-col lg:flex-row'>
					<img
						src='https://placeimg.com/260/400/arch'
						className='max-w-sm rounded-box shadow-2xl'
					/>
					<div>
						<h1 className='text-5xl font-bold'>
							Configuration
						</h1>
						<p className='py-6'>
							There is a problem with the server
							configuration. Check if your{' '}
							<a
								className={`link link-primary`}
								href={`https://next-auth.js.org/configuration/options#options`}
								target={`_blank`}
							>
								options
							</a>{' '}
							are correct.
						</p>
						<button
							className='btn btn-primary'
							type={`button`}
						>
							Get Started
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (query.error === 'AccessDenied') {
		return (
			<div className='hero min-h-full '>
				<div className='hero-content flex-col lg:flex-row'>
					<img
						src='https://placeimg.com/260/400/arch'
						className='max-w-sm rounded-box shadow-2xl'
					/>
					<div>
						<h1 className='text-5xl font-bold'>
							AccessDenied
						</h1>
						<p className='py-6'>
							Usually occurs, when you restricted access
							through the{' '}
							<a
								className={`link link-primary`}
								href={`https://next-auth.js.org/configuration/callbacks#sign-in-callback`}
								target={`_blank`}
							>
								signIn callback
							</a>
							, or{' '}
							<a
								className={`link link-primary`}
								href={`https://next-auth.js.org/configuration/callbacks#redirect-callback`}
								target={`_blank`}
							>
								redirect callback
							</a>
						</p>
						<button
							className='btn btn-primary'
							type={`button`}
						>
							Get Started
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (query.error === 'Verification') {
		return (
			<div className='hero min-h-full '>
				<div className='hero-content flex-col lg:flex-row'>
					<img
						src='https://placeimg.com/260/400/arch'
						className='max-w-sm rounded-box shadow-2xl'
					/>
					<div>
						<h1 className='text-5xl font-bold'>
							Verification
						</h1>
						<p className='py-6'>
							Related to the Email provider. The token
							has expired or has already been used
						</p>
						<button
							className='btn btn-primary'
							type={`button`}
						>
							Get Started
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='hero min-h-full '>
			<div className='hero-content flex-col lg:flex-row'>
				<img
					src='https://placeimg.com/260/400/arch'
					className='max-w-sm rounded-box shadow-2xl'
				/>
				<div>
					<h1 className='text-5xl font-bold'>Default</h1>
					<p className='py-6'>
						Catch all, will apply, if none of the above
						matched
					</p>
					<button
						className='btn btn-primary'
						type={`button`}
					>
						Get Started
					</button>
				</div>
			</div>
		</div>
	);
};
