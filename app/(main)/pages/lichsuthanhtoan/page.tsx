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
import { Button } from 'primereact/button';
import { ActionSheet, Input } from 'antd-mobile';
import { dsthanhtoanType, thanhtoanStore } from '@/store/thanhtoanStore';
import { addData, delData, updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { confirmDialog } from 'primereact/confirmdialog';
import moment from 'moment';
const dbThanhtoan = 'thanhtoan';
const DetailConngno = ({ onClose, dataEdit }: { dataEdit: dsthanhtoanType; onClose: () => void }) => {
    const [value, setValue] = useState<dsthanhtoanType>(
        dataEdit.id
            ? JSON.parse(JSON.stringify(dataEdit))
            : {
                  idDoitac: '',
                  sotien: 0
              }
    );
    const { phieunhap } = hangnhapStore();
    const [open, setOpen] = useState(false);
    const { lienhe } = lienheStore();
    const footer = (
        <>
            <Button
                security="danger"
                outlined
                onClick={() => {
                    confirmDialog({
                        message: 'Bạn có chắc muốn xóa không',
                        header: 'Xác nhận!',
                        accept: () => {
                            loadingRef.current?.on();
                            delData(dbThanhtoan, dataEdit.id, () => {
                                loadingRef.current?.off();
                                onClose();
                            });
                        }
                    });
                }}
                label="Xóa"
            ></Button>
            <Button
                onClick={() => {
                    loadingRef.current?.on();
                    if (dataEdit?.id)
                        return updateData(
                            dbThanhtoan,
                            dataEdit.id,
                            value,
                            () => {
                                onClose();
                                loadingRef.current?.off();
                            },
                            () => loadingRef.current?.off()
                        );

                    addData(
                        dbThanhtoan,
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
    const [search, setSearch] = useState('');
    return (
        <Dialog footer={footer} header={'Danh sách đơn'} visible={true} onHide={onClose}>
            <div className="DetailConngno">
                <label>
                    <Button
                        label={value.idDoitac ? lienhe.find((i) => i.id === value.idDoitac)?.name : 'Chọn đối tác'}
                        size="small"
                        outlined
                        onClick={() => setOpen(true)}
                        style={{
                            width: '100%'
                        }}
                    ></Button>
                    {open && (
                        <ActionSheet
                            extra={
                                <div>
                                    <Input
                                        placeholder="Tìm kiếm..."
                                        onChange={(e) => {
                                            setSearch(e);
                                        }}
                                    ></Input>
                                </div>
                            }
                            onMaskClick={() => {
                                setOpen(false);
                                setSearch('');
                            }}
                            onAction={(e) => {
                                setOpen(false);
                                setSearch('');
                                setValue((pre) => ({
                                    ...pre,
                                    idDoitac: e.id
                                }));
                            }}
                            visible
                            actions={lienhe.filter((i) => i.name.toLowerCase().includes(search?.toLowerCase())).map((i) => ({ ...i, key: i.id, text: i.name }))}
                        ></ActionSheet>
                    )}
                </label>
                <label>
                    <div>Nhập số tiền</div>
                    <Input
                        onChange={(e) =>
                            setValue((pre) => ({
                                ...pre,
                                sotien: e * 1000
                            }))
                        }
                        value={value.sotien / 1000}
                        type="number"
                    ></Input>
                </label>
            </div>
        </Dialog>
    );
};
export default function Congno() {
    const { getThanhtoan, dsThanhtoan } = thanhtoanStore();
    const { getLienhe, lienhe } = lienheStore();
    useEffect(() => {
        getThanhtoan();
        getLienhe();
    }, []);
    const [open, setOpen] = useState<dsthanhtoanType[] | boolean>(false);
    return (
        <div className="khachhang-container">
            {open && <DetailConngno onClose={() => setOpen(false)} dataEdit={open as dsthanhtoanType[]}></DetailConngno>}
            <div
                style={{
                    padding: '10px',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h4>Lịch sử thanh toán</h4>
                <Button onClick={() => setOpen(true)} label="Thêm"></Button>
            </div>
            <div className="congno-content">
                {dsThanhtoan.map((i) => {
                    return (
                        <div
                            onClick={() => setOpen(i)}
                            className="congnoItem"
                            key={i.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}
                        >
                            <div>{lienhe.find((x) => x.id === i.idDoitac)?.name}</div>
                            <div className="itemcongno">
                                <div>{formatNumber(i.sotien)}</div>
                                <span>{moment(i.time).format('DD-MM-YYYY')}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
