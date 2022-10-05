import { FilterFn } from '@tanstack/table-core';

export type TBuildFuzzyFilter = <TData>() => FilterFn<TData>;
