export const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div
			className={`fixed w-screen h-screen bg-black/30 z-20 p-4`}
		>
			<div
				className={`card bg-base-100 max-w-5xl w-full h-full shadow-xl mx-auto p-2`}
			>
				<button
					className={'btn btn-circle ml-auto mb-2'}
					onClick={onClose}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth='2'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>
				{children}
			</div>
		</div>
	);
};
