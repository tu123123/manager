'use client';
import { Card } from 'primereact/card';
import '../donhang.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import deletesvg from '@/compnents/assets/delete.svg';
import editsvg from '@/compnents/assets/edit.svg';
import detailsvg from '@/compnents/assets/detail.svg';
import React, { useEffect, useRef, useState } from 'react';
import downSvg from '@/compnents/assets/download.svg';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { addData, delData, getData2, updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { danhsachphieuType, hangnhapStore, phieunhapItemtype, phieunhaptype } from '@/store/hangnhapStore';
import moment from 'moment';
import Image from 'next/image';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { cuocxeType, lienheStore } from '@/store/lienheStore';
import { formatNumber } from '@/compnents/e2e';
import { uuid } from 'uuidv4';
import { toPng } from 'html-to-image';
import { donhangItem } from '@/store/donhangStore';
import { billcuocxeType, cuocxeItem, cuocxeItemGroup, cuocxetore } from '@/store/cuocxeStore';
import { Capacitor } from '@capacitor/core';
import { SelectComponent } from '@/compnents/InputSearch/selectComponent';
const dbcuocxe = 'billcuocxe';

const ItemPhieunhap = ({ item, onSetdata, onDelete }: { onDelete: () => void; item: cuocxeItem; onSetdata: () => void }) => {
    const { cuocxe } = lienheStore();
    return (
        <tr>
            <td colSpan={3}>
                <SelectComponent
                    data={cuocxe}
                    value={item.ten}
                    label="label"
                    onChange={(e) => {
                        item.idDiadiem = e.value;
                        item.ten = e.label as string;
                        item.gia = e.value as number;
                        onSetdata();
                    }}
                ></SelectComponent>
                {/* <Dropdown
                    filter
                    style={{
                        height: '30px'
                    }}
                    value={item.idDiadiem}
                    options={cuocxe}
                    onChange={(e) => {
                        item.idDiadiem = e.value;
                        item.ten = cuocxe.find((x) => x.id === e.value)?.label as string;
                        item.gia = cuocxe.find((x) => x.id === e.value)?.value as number;
                        onSetdata();
                    }}
                    optionLabel="label"
                    optionValue="id"
                ></Dropdown> */}
            </td>
            <td>
                <InputNumber
                    value={item.soluong}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(e) => {
                        item.soluong = e.value as number;
                        onSetdata();
                    }}
                ></InputNumber>
            </td>
            <td>x</td>
            <td>
                <InputNumber
                    mode="decimal"
                    value={item.gia / 1000}
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(e) => {
                        item.gia = (e.value as number) * 1000;
                        onSetdata();
                    }}
                ></InputNumber>
            </td>

            <td>
                <Button
                    onClick={() => {
                        confirmDialog({
                            message: 'Bạn có chắc muốn xóa dòng này',
                            header: 'Xác nhận!',
                            accept: () => {
                                item.delete = true;
                                onDelete();
                            }
                        });
                    }}
                    outlined
                    security="danger"
                    size="small"
                    icon={<Image src={deletesvg} alt="" height={20}></Image>}
                ></Button>
            </td>
        </tr>
    );
};
const InputGroup = ({ item, onSetdata, onDelete }: { onDelete: () => void; item: cuocxeItemGroup; onSetdata: () => void }) => {
    const emtryItem: cuocxeItem = {
        id: uuid(),
        soluong: 0,
        gia: 0,
        ten: '',
        idDiadiem: ''
    };
    return (
        <div className="inputGroup">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                }}
            >
                <InputText
                    value={item.ten}
                    onChange={(e) => {
                        item.ten = e.target.value;
                        onSetdata();
                    }}
                ></InputText>{' '}
                <Button
                    onClick={() => {
                        confirmDialog({
                            message: 'Bạn có chắc muốn xóa nhóm này',
                            header: 'Xác nhận!',
                            accept: () => {
                                item.delete = true;
                                onDelete();
                            }
                        });
                    }}
                    outlined
                    security="danger"
                    size="small"
                    icon={<Image src={deletesvg} alt="" height={20}></Image>}
                ></Button>
            </div>
            <table>
                {item.itemList.map((i) => {
                    return (
                        <ItemPhieunhap
                            onDelete={() => {
                                item.itemList = item.itemList.filter((x) => !x.delete);
                                onSetdata();
                            }}
                            item={i}
                            onSetdata={onSetdata}
                            key={i.id}
                        ></ItemPhieunhap>
                    );
                })}
            </table>
            <div>
                <Button
                    onClick={() => {
                        item.itemList = [...item.itemList, emtryItem];
                        onSetdata();
                    }}
                    size="small"
                    outlined
                    label="Thêm dòng"
                ></Button>
            </div>
        </div>
    );
};
const ModalAddphieunhap = ({ onClose, dataEdit }: { onClose: () => void; dataEdit: billcuocxeType }) => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const [value, setValue] = useState<billcuocxeType>({ ...dataEdit });

    const emtryItemGroup: cuocxeItemGroup = {
        id: uuid(),
        ten: '',
        itemList: []
    };
    const footer = (
        <>
            <Button
                onClick={() => {
                    setValue((pre) => ({
                        ...pre,
                        itemList: [...pre.itemList, { ...emtryItemGroup, id: uuid() }]
                    }));
                }}
                label="Thêm dòng"
            ></Button>
            <Button
                onClick={() => {
                    loadingRef.current?.on();
                    if (id)
                        return updateData(
                            dbcuocxe,
                            id,
                            {
                                itemList: value.itemList
                            },
                            () => {
                                loadingRef.current?.off();
                                onClose();
                            },
                            () => {
                                loadingRef.current?.off();
                            }
                        );
                }}
                label="Lưu"
            ></Button>
        </>
    );
    useEffect(() => {}, []);
    return (
        <Dialog onHide={onClose} header="Chỉnh sửa phiếu" footer={footer} visible>
            <div className="editphieu"></div>
            <div className="danhsachphieu">
                <div className="ItemPhieunhap">
                    <div className="item-phieu">
                        <table>
                            {value.itemList.map((i) => {
                                return (
                                    <InputGroup
                                        onDelete={() => {
                                            setValue((pre) => ({ ...pre, itemList: pre.itemList.filter((x) => !x.delete) }));
                                        }}
                                        item={i}
                                        onSetdata={() => setValue((pre) => ({ ...pre }))}
                                        key={i.id}
                                    ></InputGroup>
                                );
                            })}
                        </table>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};
const ItemDonhang = ({ item, setOpen, reffc }: { reffc: (e) => void; item: billcuocxeType; setOpen: () => void }) => {
    return (
        <Card ref={(e) => reffc(e)} key={item.id} title={item.ten}>
            <table
                className="tableItemcuocxe"
                style={{
                    width: '100%'
                }}
            >
                {item.itemList.map((x) => {
                    return (
                        <React.Fragment key={x.id}>
                            <tr>
                                <td>{x.ten}</td>
                            </tr>
                            {x.itemList.map((i, index) => {
                                return (
                                    <tr key={i.id}>
                                        <td className={index == x.itemList.length - 1 ? 'itemChillEndpoint' : 'itemChill'}>{i.ten}</td>
                                        <td>:</td>
                                        <td>{i.soluong}</td>
                                        <td>x</td>
                                        <td>{formatNumber(i.gia)}</td>
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </table>
            <div className="footerTable">
                <strong>Tổng:</strong> <strong> {formatNumber(item.itemList.reduce((a, b) => a + b.itemList.reduce((c, d) => c + d.gia * d.soluong, 0), 0))}</strong>
            </div>
        </Card>
    );
};
export default function Chitietnhaphang() {
    const [open, setOpen] = useState(false);
    const { getBillxe, billCuoc } = cuocxetore();
    const { getLienhe, getCuocxe } = lienheStore();
    const imgRef = useRef();
    const footerContent = () => {
        const item = billCuoc.find((x) => x.id === new URLSearchParams(window.location.search).get('id'));
        return (
            <div
                style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'end'
                }}
            >
                <Button icon={<Image src={editsvg} alt="" height={20}></Image>} raised outlined size="small" onClick={() => setOpen(item)}></Button>
                <Button
                    raised
                    outlined
                    size="small"
                    onClick={async () => {
                        const el = imgRef.current.querySelector('.p-card-body');

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
                    }}
                    icon={<Image src={downSvg} alt="" height={20}></Image>}
                ></Button>
            </div>
        );
    };
    useEffect(() => {
        getBillxe();
        getLienhe();
        getCuocxe();
    }, []);
    return (
        <div className="chitietphieunhap">
            {open && <ModalAddphieunhap dataEdit={open} onClose={() => setOpen(null)}></ModalAddphieunhap>}
            <div
                className=""
                style={{
                    padding: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h4>Chi tiết cước xe</h4>
                <div>{footerContent()}</div>
            </div>
            <div className="chitietphieunhap-body">
                {billCuoc
                    .filter((x) => x.id === new URLSearchParams(window.location.search).get('id'))
                    .map((x) => {
                        return <ItemDonhang reffc={(e) => (imgRef.current = e)} item={x} setOpen={() => setOpen(x)} key={x.id}></ItemDonhang>;
                    })}
            </div>
        </div>
    );
}
