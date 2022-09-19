export const Toast = ({ type, message }) => {
	let toastType;

	switch (type) {
		case 'success':
			toastType = 'alert-success';
			break;
		case 'error':
			toastType = 'alert-error';
			break;
		case 'warning':
			toastType = 'alert-warning';
			break;
		case 'info':
			toastType = 'alert-info';
			break;
	}

	if (!message) return null;

	return (
		<div className='toast toast-top toast-center'>
			<div className={`alert ${toastType}`}>
				<div>
					<span className={`text-center min-w-[30ch]`}>
						{message}
					</span>
				</div>
			</div>
		</div>
	);
};
