import { getData, getData2 } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { create } from 'zustand';

export interface dsthanhtoanType {
    id?: string;
    time?: string;
    idDoitac: string;
    sotien: number;
}
interface ThanhtoanStore {
    dsThanhtoan: dsthanhtoanType[];
    getThanhtoan: () => void;
}
export const thanhtoanStore = create<ThanhtoanStore>((set) => ({
    dsThanhtoan: [],
    getThanhtoan: () => {
        loadingRef.current?.on();
        getData('thanhtoan', (e) => {
            set({
                dsThanhtoan: e.reverse()
            });
            loadingRef.current?.off();
        });
    }
}));
