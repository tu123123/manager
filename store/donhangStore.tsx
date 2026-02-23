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
export interface hangxuatType {
    id?: string;
    time: string;
    ten: string;
    itemList: donhangItem[];
}
interface DonHangStore {
    hangnhap: {
        id?: string;
        endbill: boolean;
        import: boolean;
        itemList: donhangItem[];
    }[];
    hangxuat: hangxuatType[];
    getHangxuat: () => void;
    getHangxuatById: (e: string, success: (e?: hangxuatType) => void) => void;
    getHangnhap: () => void;
}
export const donHangStore = create<DonHangStore>((set) => ({
    hangxuat: [],
    hangnhap: [],
    getHangxuat: () => {
        getData('hangxuat', (e) => {
            set({
                hangxuat: e?.reverse()
            });
        });
    },
    getHangxuatById: (id, success) => {
        loadingRef.current?.on();

        getData('hangxuat', (e: hangxuatType[]) => {
            set({
                hangxuat: e?.reverse()
            });
            success(e.find((x) => x.id === id));
            loadingRef.current?.off();
        });
    },
    getHangnhap: () => {
        loadingRef.current?.on();
        getData('hangnhap', (e) => {
            set({
                hangnhap: e?.reverse()
            });
            loadingRef.current?.off();
        });
    }
}));
