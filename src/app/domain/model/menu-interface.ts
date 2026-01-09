export interface IMenu {
    label: string;
    path?: string;
    action?: () => void;
}