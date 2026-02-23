'use client';

import { ListDrop } from '@/compnents/ListDrop/listDrop';
import { ListDropGroup } from '@/compnents/ListDropGroup/listDropgroup';
import './index.scss';
import { lienheStore } from '@/store/lienheStore';
import { danhsachphieuType, hangnhapStore } from '@/store/hangnhapStore';
import { useEffect, useRef, useState } from 'react';

import downSvg from '@/compnents/assets/download.svg';
import { formatNumber } from '@/compnents/e2e';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ActionSheet, Input } from 'antd-mobile';
import { dsthanhtoanType, thanhtoanStore } from '@/store/thanhtoanStore';
import { addData, delData, updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { confirmDialog } from 'primereact/confirmdialog';
import moment from 'moment';
import { dbmathang, dsMathangType, mathangStore } from '@/store/mathangStore';
import Image from 'next/image';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { toPng } from 'html-to-image';
const dbThanhtoan = dbmathang;
const DetailConngno = ({ onClose, dataEdit }: { dataEdit: dsMathangType; onClose: () => void }) => {
    const [value, setValue] = useState<dsMathangType>(
        dataEdit.id
            ? JSON.parse(JSON.stringify(dataEdit))
            : {
                  ten: '',
                  gia: 0
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
        <Dialog footer={footer} header={dataEdit?.id ? 'Cập nhật' : 'Thêm mới'} visible={true} onHide={onClose}>
            <div className="DetailConngno">
                <label>
                    <div>Nhập tên</div>
                    <Input
                        onChange={(e) =>
                            setValue((pre) => ({
                                ...pre,
                                ten: e
                            }))
                        }
                        type="text"
                        value={value.ten}
                    ></Input>
                </label>
                <label>
                    <div>Nhập số tiền</div>
                    <Input
                        onChange={(e) =>
                            setValue((pre) => ({
                                ...pre,
                                gia: e * 1000
                            }))
                        }
                        value={value.gia / 1000}
                        type="number"
                    ></Input>
                </label>
            </div>
        </Dialog>
    );
};
export default function Congno() {
    const { dsMathang, getMatHang } = mathangStore();
    const { getLienhe, lienhe } = lienheStore();
    useEffect(() => {
        getMatHang();
    }, []);
    const imgRef = useRef();
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
                <h4>Danh sách hàng hóa</h4>
                <div
                    style={{
                        display: 'flex',
                        gap: '5px'
                    }}
                >
                    <Button onClick={() => setOpen(true)} label="Thêm"></Button>
                    <Button
                        raised
                        outlined
                        size="small"
                        onClick={async () => {
                            const el = imgRef.current;
                            el.style.height = 'max-content';
                            const dataUrl = await toPng(el, { cacheBust: true, backgroundColor: '#ffffff' });

                            const base64Data = dataUrl.split(',')[1];

                            if (Capacitor.isNativePlatform()) {
                                // ✅ ANDROID / IOS
                                await Filesystem.requestPermissions();

                                await Filesystem.writeFile({
                                    path: `export-${Date.now()}.png`,
                                    data: base64Data,
                                    directory: Directory.Documents,
                                    encoding: Encoding.Base64
                                });

                                alert('Đã lưu vào Documents 📁');
                            } else {
                                // ✅ WEB
                                const link = document.createElement('a');
                                link.href = dataUrl;
                                link.download = 'export.png';
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                            }
                            el.style.height = '100%';
                        }}
                        icon={<Image src={downSvg} alt="" height={20}></Image>}
                    ></Button>
                </div>
            </div>
            <div ref={imgRef} className="congno-content">
                {dsMathang.map((i) => {
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
                            <div>{i.ten}</div>
                            <div className="itemcongno">
                                <div>{formatNumber(i.gia)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
