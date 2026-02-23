'use client';
import { Card } from 'primereact/card';
import './donhang.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { getData2 } from '@/compnents/config';
import { donHangStore } from '@/store/donhangStore';
const ModalDonhang = ({ onClose }: { onClose: () => void }) => {
    const [value, setValue] = useState('');
    return (
        <Dialog onHide={onClose} header="Thêm đơn hàng" visible>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="username">Nhập tên đơn hàng</label>
                <InputText id="username" value={value} onChange={(e) => setValue(e.target.value)} />
            </label>
        </Dialog>
    );
};
export default function DonHang() {
    const [open, setOpen] = useState(false);
    const columns = [
        {
            label: 'Ngày',
            dataIndex: 'date'
        },
        {
            label: 'Tổng',
            dataIndex: 'total'
        },
        {
            label: 'Thao tác',
            dataIndex: 'total'
        }
    ];

    return (
        <div className="Donhang">
            {open && <ModalDonhang onClose={() => setOpen(false)}></ModalDonhang>}
            <Card
                className=""
                title=""
                header={
                    <div
                        style={{
                            padding: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <h4>Danh sách đơn hàng</h4>
                        <Button onClick={() => setOpen(true)} label="Thêm đơn hàng"></Button>
                    </div>
                }
            >
                <DataTable>
                    {columns.map((i) => {
                        return <Column key={i.label} header={i.label}></Column>;
                    })}
                </DataTable>
            </Card>
        </div>
    );
}
