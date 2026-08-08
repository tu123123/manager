import { getData, getData2 } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { create } from 'zustand';
interface lienheType {
    id: string;
    import?: boolean;
    name: string;
    time: string;
}
export interface phieunhapItemtype {
    soluong: number;
    gia: number;
    pay: boolean;
    ten: string;
    time:string;
    id?: string;
}

export interface phieunhaptypemess {
    id?: string;
    ten: string;
    iduser:string;
    time?: string;
    itemList:phieunhapItemtype[]
}

interface MesschitieuStore {
    phieunhapmess: phieunhaptypemess[];
    getmessPhieunhap: () => void;
}
export const messchitieuStore = create<MesschitieuStore>((set) => ({
    phieunhapmess: [],
    
    getmessPhieunhap: () => {
        loadingRef.current?.on();
        getData('donchitieu', (e) => {
            set({
                phieunhapmess: e.reverse()
            });
            loadingRef.current?.off();
        });
    },

}));
