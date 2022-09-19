import { useCallback, useState } from 'react';

export const useToggle = (initialState = false) => {
	const [isToggled, setIsToggled] = useState(initialState);
	const toggle = useCallback(
		() => setIsToggled((prevState) => !prevState),
		[],
	);
	const toggleOn = useCallback(() => setIsToggled(true), []);
	const toggleOff = useCallback(() => setIsToggled(false), []);

	return [isToggled, toggle, toggleOn, toggleOff] as const;
};
