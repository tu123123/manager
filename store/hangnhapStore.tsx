import { getData, getData2 } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { create } from 'zustand';
interface lienheType {
    id: string;
    import?: boolean;
    name: string;
    time: string;
}

export interface phieunhaptype {
    id?: string;
    ten: string;
    time?: string;
}
export interface phieunhapItemtype {
    soluong: number;
    gia: number;
    delete?: boolean;
    ten: string;
    id?: string;
}
export interface danhsachphieuType {
    id?: string;
    group: string;
    itemList: phieunhapItemtype[];

    tenDoiTac: string;
    idDoitac: string;
}
interface HangnhapStore {
    phieunhap: phieunhaptype[];
    danhsachPhieu: danhsachphieuType[];
    getPhieunhap: () => void;
    getDanhSachPhieunhap: () => void;
}
export const hangnhapStore = create<HangnhapStore>((set) => ({
    phieunhap: [],
    danhsachPhieu: [],
    getPhieunhap: () => {
        loadingRef.current?.on();
        getData('phieunhap', (e) => {
            set({
                phieunhap: e.reverse()
            });
            loadingRef.current?.off();
        });
    },
    getDanhSachPhieunhap: () => {
        loadingRef.current?.on();
        getData('danhsachphieunhap', (e) => {
            set({
                danhsachPhieu: e.reverse()
            });
            loadingRef.current?.off();
        });
    }
}));
