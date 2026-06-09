import { getData, getData2 } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { create } from 'zustand';
export const dbkhachmoi = 'chiphidamcuoi';
export interface dskhachmoistype {
    id?: string;
    time?: string;
    ten: string;
    status:boolean;
    sotien: number;
}
interface MathangStore {
    dsKhachmoi: dskhachmoistype[];
    getDsKhachmoi: () => void;
}
export const chiphidamcuoiStore = create<MathangStore>((set, get) => ({
    dsKhachmoi: [],
    getDsKhachmoi: () => {
        if (get().dsKhachmoi.length > 0) return;
        loadingRef.current?.on();
        getData(dbkhachmoi, (e) => {
            set({
                dsKhachmoi: e.reverse()
            });
            loadingRef.current?.off();
        });
    }
}));
