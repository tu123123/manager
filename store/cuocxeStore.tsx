import { getData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { create } from 'zustand';
export interface itemList {
    checked: boolean;
    cost: number;
    gia: number;
    index: number;
    new: boolean;
    note: string;
    delete?: boolean;
    id: string;
    soluong: number;

    ten: string;
}
export interface donhangItem {
    date: string;
    endbill?: boolean;
    id: string;
    sothung: number;
    itemList: itemList[];
    name: string;
    time: string;
}
export interface cuocxeItemGroup {
    id: string;
    ten: string;
    itemList: cuocxeItem[];
}
export interface cuocxeItem {
    id: string;
    ten: string;
    idDiadiem: string;
    soluong: number;
    gia: number;
}
export interface billcuocxeType {
    id?: string;
    ten: string;
    time: string;
    itemList: cuocxeItemGroup[];
}
interface CuocXeStore {
    billCuoc: billcuocxeType[];
    getBillxe: () => void;
}
export const cuocxetore = create<CuocXeStore>((set) => ({
    billCuoc: [],

    getBillxe: () => {
        loadingRef.current?.on();
        getData('billcuocxe', (e) => {
            set({
                billCuoc: e?.reverse()
            });
            loadingRef.current?.off();
        });
    }
}));
