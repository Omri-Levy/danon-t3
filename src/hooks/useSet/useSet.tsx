import { useState } from 'react';
import { AnyArray } from '../../types';

export const useSet = <TType,>(initialSet?: Set<TType>) => {
	const [set, setSet] = useState<Set<TType>>(
		initialSet ?? new Set(),
	);
	const add = (item: TType) =>
		setSet((set) => {
			const newSet = new Set([...set]);
			newSet.add(item);

			return newSet;
		});
	const remove = (item: TType) =>
		setSet((set) => {
			const newSet = new Set([...set]);
			newSet.delete(item);

			return newSet;
		});
	const toggle = (item: TType) =>
		setSet((set) => {
			const newSet = new Set([...set]);

			if (newSet.has(item)) {
				newSet.delete(item);
			} else {
				newSet.add(item);
			}

			return newSet;
		});
	const clear = () => setSet(new Set());
	const toggleAll = (setB: Set<TType>) =>
		setSet((set) => {
			const newSet = new Set([...set]);

			setB.forEach((item) =>
				newSet.has(item)
					? newSet.delete(item)
					: newSet.add(item),
			);

			return newSet;
		});
	const merge = (newSet: Set<TType>) =>
		setSet((set) => new Set([...set, ...newSet]));
	const array = () => Array.from(set);
	const arrayToSet = <TArray extends AnyArray>(array: TArray) =>
		setSet(new Set(array));

	const actions = {
		set: setSet,
		add,
		remove,
		toggle,
		toggleAll,
		clear,
		merge,
		array,
		arrayToSet,
	};

	return [set, actions] as const;
};
