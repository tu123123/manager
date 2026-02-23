'use client';
import { Card } from 'primereact/card';
import './khachhang.scss';
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
import { lienheStore } from '@/store/lienheStore';
import { confirmDialog } from 'primereact/confirmdialog';
import { loadingRef } from '@/layout/AppConfig';
import { donHangStore } from '@/store/donhangStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import moment from 'moment';

const ModalKhachhang = ({ onClose, dataEdit }: { onClose: () => void; dataEdit: unknown }) => {
    const [loading, setLoading] = useState(false);
    const update = () => {
        updateData(
            'hangxuat',
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
            'hangxuat',

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
                  ten: '',
                  itemList: []
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
        <Dialog onHide={onClose} header={dataEdit.id ? 'Cập nhật đơn hàng' : 'Thêm đơn hàng'} visible footer={footerContent}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="username">Nhập tên đơn hàng</label>
                <InputText id="username" value={value.ten} onChange={(e) => setValue((pre) => ({ ...pre, ten: e.target.value }))} />
            </label>
        </Dialog>
    );
};
export default function XuatHang() {
    const router = useRouter();
    const [open, setOpen] = useState(null);
    const { hangxuat, getHangxuat } = donHangStore();
    const columns = [
        {
            label: 'Ngày âm',
            dataIndex: 'ten'
        },
        {
            label: 'Ngày dương',
            dataIndex: 'time',
            render: (e) => moment(e.time).format('DD/MM/YYYY')
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
                        <Button
                            onClick={() => setOpen(data)}
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
                            icon={<Image alt="" height={20} src={detailsvg}></Image>}
                            onClick={() => router.push('/pages/chitietdonhang?id=' + data.id)}
                        ></Button>
                        <Button
                            outlined
                            style={{
                                height: '30px'
                            }}
                            icon={<Image alt="" height={20} src={deletesvg}></Image>}
                            onClick={() => {
                                confirmDialog({
                                    message: 'Bạn có chắc muốn xóa đơn hàng này không',
                                    header: 'Xác nhận!',
                                    accept: () => {
                                        loadingRef.current?.on();
                                        delData('hangxuat', data.id, () => {
                                            loadingRef.current?.off();
                                        });
                                    }
                                });
                            }}
                            severity="danger"
                        ></Button>
                    </div>
                );
            }
        }
    ];
    useEffect(() => getHangxuat(), []);
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
                <h4>Danh sách đơn hàng</h4>
                <Button onClick={() => setOpen(true)} label="Thêm đơn hàng"></Button>
            </div>

            <DataTable scrollable scrollHeight="100%" virtualScrollerOptions={{ itemSize: 30 }} value={hangxuat}>
                {columns.map((i) => {
                    return <Column field={i.dataIndex} key={i.label} header={i.label} body={i.render}></Column>;
                })}
            </DataTable>
        </div>
    );
}
