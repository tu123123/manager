import { getData, getData2 } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { create } from 'zustand';
export const dbmathang = 'mathang';
export interface dsMathangType {
    id?: string;
    time?: string;
    ten: string;
    gia: number;
}
interface MathangStore {
    dsMathang: dsMathangType[];
    getMatHang: () => void;
}
export const mathangStore = create<MathangStore>((set, get) => ({
    dsMathang: [],
    getMatHang: () => {
        if (get().dsMathang.length > 0) return;
        loadingRef.current?.on();
        getData(dbmathang, (e) => {
            set({
                dsMathang: e.reverse()
            });
            loadingRef.current?.off();
        });
    }
}));
