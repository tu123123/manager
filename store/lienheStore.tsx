import { getData, getData2 } from '@/compnents/config';
import { create } from 'zustand';
interface lienheType {
    id: string;
    import?: boolean;
    name: string;
    time: string;
}
interface congnoType {
    id: string;
    import?: boolean;
    name: string;
    time: string;
}
export interface cuocxeType {
    id?: string;
    label: string;
    value: number;
}
interface LienheStore {
    lienhe: lienheType[];
    cuocxe: cuocxeType[];
    getCuocxe: () => void;
    getLienhe: () => void;
}
export const lienheStore = create<LienheStore>((set) => ({
    lienhe: [],
    cuocxe: [],
    getCuocxe: () => {
        getData('cuocxe', (e) =>
            set({
                cuocxe: e
            })
        );
    },
    getLienhe: () => {
        getData('lienhe', (e) =>
            set({
                lienhe: e
            })
        );
    }
}));
