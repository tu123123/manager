'use client';
import { Card } from 'primereact/card';
import './donhang.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import deletesvg from '@/compnents/assets/delete.svg';
import editsvg from '@/compnents/assets/edit.svg';
import detailsvg from '@/compnents/assets/detail.svg';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { addData, delData, getData2, updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { danhsachphieuType, hangnhapStore, phieunhaptype } from '@/store/hangnhapStore';
import moment from 'moment';
import Image from 'next/image';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { lienheStore } from '@/store/lienheStore';
import { formatNumber } from '@/compnents/e2e';
import { useRouter } from 'next/navigation';
const dbPhieunhap = 'phieunhap';
const dbDanhsachphieunhap = 'danhsachphieunhap';
const ModalDonhang = ({ onClose, dataEdit }: { onClose: () => void; dataEdit: phieunhaptype }) => {
    const [value, setValue] = useState(
        dataEdit?.id
            ? JSON.parse(JSON.stringify(dataEdit))
            : {
                  ten: '',
                  itemList: []
              }
    );
    const footer = (
        <>
            <Button
                onClick={() => {
                    loadingRef.current?.on();
                    if (dataEdit?.id)
                        return updateData(
                            dbPhieunhap,
                            dataEdit.id,
                            value,
                            () => {
                                onClose();
                                loadingRef.current?.off();
                            },
                            () => loadingRef.current?.off()
                        );

                    addData(
                        dbPhieunhap,
                        value,
                        () => {
                            onClose();
                            loadingRef.current?.off();
                        },
                        () => loadingRef.current?.off()
                    );
                }}
                label="Lưu"
            ></Button>
        </>
    );
    return (
        <Dialog onHide={onClose} header="Thêm đơn hàng" footer={footer} visible>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="username">Nhập tên phiếu nhập</label>
                <InputText id="username" value={value.ten} onChange={(e) => setValue((pre) => ({ ...pre, ten: e.target.value }))} />
            </label>
        </Dialog>
    );
};

export default function Nhaphang() {
    const [open, setOpen] = useState(false);
    const { phieunhap, getPhieunhap } = hangnhapStore();
    const { getLienhe } = lienheStore();
    useEffect(() => {
        getPhieunhap();
        getLienhe();
    }, []);
    const router = useRouter();
    return (
        <div className="phieunhap">
            {open && <ModalDonhang dataEdit={open} onClose={() => setOpen(false)}></ModalDonhang>}
            <div
                className=""
                style={{
                    padding: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h4>Danh sách hàng nhập</h4>
                <Button onClick={() => setOpen(true)} label="Thêm phiếu nhập"></Button>
            </div>
            <div className="phieunhap-body">
                {phieunhap.map((i) => {
                    return (
                        <Card
                            footer={
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'end',
                                        gap: '5px'
                                    }}
                                >
                                    <Button
                                        onClick={() => {
                                            setOpen(i);
                                        }}
                                        outlined
                                        style={{
                                            height: '30px'
                                        }}
                                        icon={<Image alt="" height={20} src={editsvg}></Image>}
                                    ></Button>
                                    <Button
                                        outlined
                                        style={{
                                            height: '30px'
                                        }}
                                        onClick={() => {
                                            router.push('/pages/nhaphang/chitietnhaphang?id=' + i.id);
                                        }}
                                        icon={<Image alt="" height={20} src={detailsvg}></Image>}
                                    ></Button>
                                    <Button
                                        outlined
                                        style={{
                                            height: '30px'
                                        }}
                                        icon={<Image alt="" height={20} src={deletesvg}></Image>}
                                        onClick={() => {
                                            confirmDialog({
                                                message: 'Bạn có chắc muốn xóa phiếu này không',
                                                header: 'Xác nhận!',
                                                accept: () => {
                                                    loadingRef.current?.on();
                                                    delData(dbPhieunhap, i.id, () => {
                                                        loadingRef.current?.off();
                                                    });
                                                }
                                            });
                                        }}
                                        severity="danger"
                                    ></Button>
                                </div>
                            }
                            key={i.id}
                            title={i.ten}
                            subTitle={moment(i.time).format('DD/MM/YYYY')}
                        ></Card>
                    );
                })}
            </div>
        </div>
    );
}
