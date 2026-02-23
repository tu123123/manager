'use client';

import { ListDrop } from '@/compnents/ListDrop/listDrop';
import { ListDropGroup } from '@/compnents/ListDropGroup/listDropgroup';
import './index.scss';
import { lienheStore } from '@/store/lienheStore';
import { danhsachphieuType, hangnhapStore } from '@/store/hangnhapStore';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';
import { formatNumber } from '@/compnents/e2e';
import { Dialog } from 'primereact/dialog';
import { thanhtoanStore } from '@/store/thanhtoanStore';
const DetailConngno = ({ onClose, listCongno }: { listCongno: danhsachphieuType[]; onClose: () => void }) => {
    const [value, setValue] = useState();
    const { dsThanhtoan } = thanhtoanStore();
    const { phieunhap } = hangnhapStore();
    const total = listCongno.reduce((a, b) => a + b.itemList.reduce((c, d) => c + d.soluong * d.gia, 0), 0);
    const payment = dsThanhtoan.filter((x) => x.idDoitac === listCongno[0].idDoitac).reduce((a, b) => a + b.sotien, 0);
    return (
        <Dialog header={'Danh sách đơn'} visible={true} onHide={onClose}>
            <div className="DetailConngno">
                <table className="table-congno">
                    {listCongno.map((i) => {
                        return i.itemList.map((x, index) => {
                            return (
                                <tr key={x.id}>
                                    <td>{index == 0 ? phieunhap.find((xx) => xx.id === i.group)?.ten : ''}</td>
                                    <td>{x.ten}:</td> <td>{x.soluong}</td>
                                    <td>x</td>
                                    <td>{x.gia}</td>
                                    <td>=</td>
                                    <td>{formatNumber(x.gia * x.soluong)}</td>
                                </tr>
                            );
                        });
                    })}
                </table>
                <div className="footercongno">
                    <table>
                        <tr>
                            <td>Tổng:</td>
                            <td>{formatNumber(total)}</td>
                        </tr>
                        <tr>
                            <td>Đã thanh toán:</td>
                            <td>{formatNumber(payment)}</td>
                        </tr>
                        <tr
                            style={{
                                fontWeight: 'bold'
                            }}
                        >
                            <td>Còn lại:</td>
                            <td
                                style={{
                                    textAlign: 'end'
                                }}
                            >
                                {formatNumber(total - payment)}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </Dialog>
    );
};
export default function Congno() {
    const { danhsachPhieu, getPhieunhap, getDanhSachPhieunhap } = hangnhapStore();
    const { getLienhe, lienhe } = lienheStore();
    const { getThanhtoan, dsThanhtoan } = thanhtoanStore();
    useEffect(() => {
        getDanhSachPhieunhap();
        getPhieunhap();
        getLienhe();
        getThanhtoan();
    }, []);
    const [open, setOpen] = useState<danhsachphieuType[] | null>();

    return (
        <div className="khachhang-container">
            {open && <DetailConngno onClose={() => setOpen(null)} listCongno={open as danhsachphieuType[]}></DetailConngno>}
            <div
                style={{
                    padding: '10px',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h4>Danh sách Công nợ</h4>
            </div>
            <div className="congno-content">
                {lienhe
                    .sort((x, y) => {
                        const listCongno = (xx) => {
                            const payment = dsThanhtoan.filter((x) => x.idDoitac === xx.id).reduce((a, b) => a + b.sotien, 0);
                            return danhsachPhieu.filter((x) => x.idDoitac === xx.id).reduce((a, b) => a + b.itemList.reduce((c, d) => c + d.soluong * d.gia, 0), 0) - payment;
                        };
                        let a = listCongno(x);
                        let b = listCongno(y);
                        return b - a;
                    })
                    .map((i) => {
                        const listCongno = danhsachPhieu.filter((x) => x.idDoitac === i.id);
                        const total = listCongno.reduce((a, b) => a + b.itemList.reduce((c, d) => c + d.soluong * d.gia, 0), 0);
                        const payment = dsThanhtoan.filter((x) => x.idDoitac === i.id).reduce((a, b) => a + b.sotien, 0);
                        return (
                            <div
                                onClick={() => listCongno.length && setOpen(listCongno)}
                                className="congnoItem"
                                key={i.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%'
                                }}
                            >
                                <div>{i.name}</div>
                                <div className="itemcongno">{formatNumber(total - payment)}</div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
