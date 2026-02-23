'use client';
import { Card } from 'primereact/card';
import './donhang.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { addData, delData, getData2, updateData } from '@/compnents/config';
import { donHangStore } from '@/store/donhangStore';
import { loadingRef } from '@/layout/AppConfig';
import { cuocxeType, lienheStore } from '@/store/lienheStore';
import { InputNumber } from 'primereact/inputnumber';
import editsvg from '@/compnents/assets/edit.svg';
import deletesvg from '@/compnents/assets/delete.svg';
import { confirmDialog } from 'primereact/confirmdialog';
import Image from 'next/image';
import { formatNumber } from '@/compnents/e2e';
const db = 'cuocxe';
const ModalCuocxe = ({ onClose, dataEdit }: { onClose: () => void; dataEdit: cuocxeType }) => {
    const [value, setValue] = useState(
        dataEdit.id
            ? { ...dataEdit }
            : {
                  label: '',
                  value: 0
              }
    );
    const onAdd = () => {
        loadingRef.current?.on();
        if (dataEdit.id)
            updateData(
                db,
                dataEdit.id,
                value,
                () => {
                    loadingRef.current?.off();
                    onClose();
                },
                () => {
                    loadingRef.current?.off();
                }
            );
        else
            addData(db, value, () => {
                loadingRef.current?.off();
                onClose();
            });
    };
    const footer = (
        <>
            <Button onClick={onClose} label="Đóng"></Button>
            <Button onClick={onAdd} label="Lưu"></Button>
        </>
    );
    return (
        <Dialog onHide={onClose} header="Thêm địa điểm" visible footer={footer}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="username">Nhập tên địa điểm</label>
                <InputText id="username" value={value.label} onChange={(e) => setValue((pre) => ({ ...pre, label: e.target.value as string }))} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="username">Nhập giá cước</label>
                <InputNumber value={value.value / 1000} mode="decimal" minFractionDigits={0} maxFractionDigits={5} id="username" onChange={(e) => setValue((pre) => ({ ...pre, value: (e.value as number) * 1000 }))} />
            </label>
        </Dialog>
    );
};
export default function DonHang() {
    const [open, setOpen] = useState(false);
    const { getCuocxe, cuocxe } = lienheStore();
    useEffect(() => {
        getCuocxe();
    }, []);

    return (
        <div className="thietlapcuocxe">
            {open && <ModalCuocxe dataEdit={open} onClose={() => setOpen(false)}></ModalCuocxe>}
            <div className="thietlapcuocxe-header">
                <Button onClick={() => setOpen(true)} label="Thêm địa điểm"></Button>
            </div>
            <div className="thietlapcuocxe-body">
                {cuocxe.map((i) => {
                    return (
                        <Card
                            subTitle={formatNumber(i.value)}
                            key={i.id}
                            footer={
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '10px'
                                    }}
                                >
                                    <Button outlined icon={<Image height={20} alt="" src={editsvg}></Image>} onClick={() => setOpen(i)}></Button>
                                    <Button
                                        outlined
                                        security="danger"
                                        icon={<Image height={20} alt="" src={deletesvg}></Image>}
                                        onClick={() =>
                                            confirmDialog({
                                                message: 'Bạn có chắc muốn xóa địa điểm này không',
                                                header: 'Xác nhận!',
                                                accept: () => {
                                                    loadingRef.current?.on();
                                                    delData(db, i.id, () => {
                                                        loadingRef.current?.off();
                                                    });
                                                }
                                            })
                                        }
                                    ></Button>
                                </div>
                            }
                            title={i.label}
                        ></Card>
                    );
                })}
            </div>
        </div>
    );
}
