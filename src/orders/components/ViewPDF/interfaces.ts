export interface IViewPDFProps {
	presignedUrl: string;
	isOpen: boolean;
	onOpen: (nextValue?: boolean) => void;
}
