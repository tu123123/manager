'use client';
import { Card } from 'primereact/card';
import './khachhang.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { addData, delData, getData2, updateData } from '@/compnents/config';
import { lienheStore } from '@/store/lienheStore';
import { confirmDialog } from 'primereact/confirmdialog';
import { loadingRef } from '@/layout/AppConfig';

const ModalKhachhang = ({ onClose, dataEdit }: { onClose: () => void; dataEdit: unknown }) => {
    const [loading, setLoading] = useState(false);
    const update = () => {
        updateData(
            'lienhe',
            dataEdit?.id,
            value,
            () => {
                onClose();
                setLoading(true);
            },
            () => setLoading(false)
        );
    };
    const add = () => {
        addData(
            'lienhe',

            value,
            () => {
                onClose();
                setLoading(true);
            },
            () => setLoading(false)
        );
    };
    const [value, setValue] = useState(
        dataEdit?.id
            ? JSON.parse(JSON.stringify(dataEdit))
            : {
                  name: '',
                  phone: '',
                  mota: ''
              }
    );
    const footerContent = (
        <div>
            <Button label="Hủy" icon="pi pi-times" onClick={() => onClose()} autoFocus />
            <Button
                loading={loading}
                label="Lưu"
                icon="pi pi-check"
                onClick={() => {
                    setLoading(true);
                    if (dataEdit?.id) update();
                    else add();
                }}
                autoFocus
            />
        </div>
    );
    return (
        <Dialog onHide={onClose} header={dataEdit.id ? 'Cập nhật khách hàng' : 'Thêm khách hàng'} visible footer={footerContent}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="username">Nhập tên đơn hàng</label>
                <InputText id="username" value={value.name} onChange={(e) => setValue((pre) => ({ ...pre, name: e.target.value }))} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="username">Nhập Số điện thoại</label>
                <InputText id="username" value={value.phone} onChange={(e) => setValue((pre) => ({ ...pre, phone: e.target.value }))} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="username">Nhập mô tả</label>
                <InputText id="username" value={value.mota} onChange={(e) => setValue((pre) => ({ ...pre, mota: e.target.value }))} />
            </label>
        </Dialog>
    );
};
export default function KhachHang() {
    const [open, setOpen] = useState(null);
    const { lienhe, getLienhe } = lienheStore();
    const columns = [
        {
            label: 'Tên',
            dataIndex: 'name'
        },
        {
            label: 'Số điện thoại',
            dataIndex: 'phone'
        },
        {
            label: 'Mô tả',
            dataIndex: 'mota'
        },
        {
            label: 'Thao tác',
            dataIndex: 'action',
            render: (data) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px'
                        }}
                    >
                        <Button onClick={() => setOpen(data)} icon="pi-file-edit" label="Chỉnh sửa"></Button>
                        <Button
                            onClick={() => {
                                confirmDialog({
                                    message: 'Bạn có chắc muốn xóa liên hệ này không',
                                    header: 'Xác nhận!',
                                    accept: () => {
                                        loadingRef.current?.on();
                                        delData('lienhe', data.id, () => {
                                            loadingRef.current?.off();
                                        });
                                    }
                                });
                            }}
                            outlined
                            severity="danger"
                            label="Xóa"
                        ></Button>
                    </div>
                );
            }
        }
    ];
    useEffect(() => {
        getLienhe();
    }, []);
    return (
        <div className="khachhang-container">
            {open && <ModalKhachhang onClose={() => setOpen(null)} dataEdit={open}></ModalKhachhang>}
            <div
                style={{
                    padding: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h4>Danh sách khách hàng</h4>
                <Button onClick={() => setOpen(true)} label="Thêm khách hàng"></Button>
            </div>

            <DataTable value={lienhe}>
                {columns.map((i) => {
                    return <Column field={i.dataIndex} key={i.label} header={i.label} body={i.render}></Column>;
                })}
            </DataTable>
        </div>
    );
}
