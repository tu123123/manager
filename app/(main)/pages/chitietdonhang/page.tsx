'use client';
import { Card } from 'primereact/card';
import './index.scss';
import { Button } from 'primereact/button';
import { donhangItem, donHangStore, hangxuatType, itemList } from '@/store/donhangStore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatNumber } from '@/compnents/e2e';
import deletesvg from '@/compnents/assets/delete.svg';
import editsvg from '@/compnents/assets/edit.svg';
import downSvg from '@/compnents/assets/download.svg';
import Image from 'next/image';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { CascadeSelect } from 'primereact/cascadeselect';
import { lienheStore } from '@/store/lienheStore';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { addData, delData, updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { ToggleButton } from 'primereact/togglebutton';
import { confirmDialog } from 'primereact/confirmdialog';
import { toPng } from 'html-to-image';
import moment from 'moment';
import { uuid } from 'uuidv4';
import { toast } from '@/layout/AppMenu';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import InputSearch from '@/compnents/InputSearch/inputsearch';
import { SelectComponent } from '@/compnents/InputSearch/selectComponent';
const db = 'hangxuat';
const dataContent = React.createContext();
const ItemDonhang = ({ item, setValue }: { item: itemList; setValue: unknown }) => {
    const [note, setNote] = useState(false);
    return (
        <div className="itemDonhang">
            <InputSearch
                onChangeSelect={(e) => {
                    item.ten = e.ten;
                    item.gia = e.gia;
                    setValue((pre) => ({ ...pre }));
                }}
                value={item.ten}
                onChange={(e) => {
                    item.ten = e;
                    setValue((pre) => ({ ...pre }));
                }}
            ></InputSearch>
            {/* <InputText
                value={item.ten}
                onChange={(x) => {
                    item.ten = x.target.value;
                    setValue((pre) => ({ ...pre }));
                }}
            ></InputText> */}
            <div className="itemDonhang-content">
                <InputNumber
                    value={item.soluong}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(x) => {
                        item.soluong = x.value as number;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputNumber>{' '}
                x{' '}
                <InputNumber
                    value={item.gia / 1000}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(x) => {
                        item.gia = (x.value as number) * 1000;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputNumber>{' '}
                = {formatNumber(item.gia * item.soluong)}
            </div>
            {note && (
                <InputText
                    placeholder="Ghi chú"
                    value={item.note}
                    onChange={(x) => {
                        item.note = x.target.value;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputText>
            )}
            <div className="itemDonhang-footer">
                <Button
                    onClick={() => {
                        setNote(!note);
                    }}
                    outlined
                    icon={<Image height={20} alt="" src={editsvg}></Image>}
                ></Button>
                <Button
                    onClick={() => {
                        confirmDialog({
                            message: 'Bạn có chắc muốn xóa mặt hàng này',
                            header: 'Xác nhận!',
                            accept: () => {
                                item.delete = true;

                                setValue((pre) => ({ ...pre, itemList: pre.itemList.filter((x) => !x.delete) }));
                            }
                        });
                    }}
                    security="danger"
                    outlined
                    icon={<Image height={20} alt="" src={deletesvg}></Image>}
                ></Button>
            </div>
        </div>
    );
};
const EditTable = ({ onClose, dataEdit }: { onClose: () => void; dataEdit?: donhangItem }) => {
    const [value, setValue] = useState(
        dataEdit?.id
            ? { ...dataEdit }
            : {
                  date: moment().format('DD/MM/YYYY HH:mm'),
                  endbill: false,
                  id: '',
                  sothung: 0,
                  itemList: [],
                  name: '',
                  time: ''
              }
    );
    const colums = [
        {
            label: 'Tên',
            dataIndex: 'ten',
            render: (e: itemList) => (
                <InputText
                    style={{ width: '100px' }}
                    value={e.ten}
                    onChange={(x) => {
                        e.ten = x.target.value as string;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputText>
            )
        },
        {
            label: 'Số lượng',
            dataIndex: 'soluong',
            render: (e: itemList) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={e.soluong}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(x) => {
                        e.soluong = x.value as number;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputNumber>
            )
        },
        {
            label: 'Giá',
            dataIndex: 'gia',
            render: (e: itemList) => (
                <InputNumber
                    style={{ width: '100%' }}
                    value={e.gia / 1000}
                    mode="decimal"
                    minFractionDigits={0}
                    maxFractionDigits={5}
                    onChange={(x) => {
                        e.gia = (x.value as number) * 1000;
                        setValue((pre) => ({ ...pre }));
                    }}
                ></InputNumber>
            )
        },
        {
            label: 'Thành tiền',
            dataIndex: '',
            render: (e: itemList) => formatNumber(e.soluong * e.gia)
        }
    ];
    const itemEmpty = {
        checked: false,
        cost: 0,
        gia: 0,
        id: uuid(),
        new: true,
        note: '',
        soluong: 0,
        ten: ''
    };
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const { data } = useContext(dataContent);
    const update = () => {
        try {
            loadingRef.current?.on();
            const find = data.itemList.findIndex((x) => x.id == value.id);
            data.itemList[find] = { ...value };
            updateData(
                db,
                data.id,
                data,
                () => {
                    onClose();
                    loadingRef.current?.off();
                },
                () => {
                    loadingRef.current?.off();
                }
            );
        } catch (e) {
            console.log(e);
            loadingRef.current?.off();
        }
    };
    const add = () => {
        if (!value.id)
            return confirmDialog({
                message: 'Chưa chọn người nhận!',
                header: 'Cảnh báo!'
            });
        try {
            loadingRef.current?.on();
            updateData(db, data.id, { itemList: [...data.itemList, value] }, () => {
                onClose();
                loadingRef.current?.off();
            });
        } catch (e) {
            console.log(e);
            loadingRef.current?.off();
        }
    };

    const footer = (
        <div
            style={{
                display: 'flex',
                gap: '5px',
                justifyContent: 'end'
            }}
        >
            <ToggleButton
                style={{
                    height: '35px'
                }}
                onLabel="Kết thúc"
                offLabel="Kết thúc"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                checked={value.endbill}
                onChange={(e) => setValue((pre) => ({ ...pre, endbill: e.value }))}
                className="w-9rem"
            />
            <Button
                size="small"
                onClick={() => {
                    setValue((pre) => ({ ...pre, itemList: [...pre.itemList, itemEmpty] }));
                }}
                label="Thêm dòng"
            ></Button>
            <Button size="small" onClick={onClose} label="Đóng"></Button> <Button size="small" onClick={dataEdit?.id ? update : add} label="Lưu"></Button>
        </div>
    );
    const { getLienhe, lienhe } = lienheStore();
    useEffect(() => {
        getLienhe();
    }, []);

    return (
        <Dialog footer={footer} onHide={onClose} visible header="Cập nhật đơn hàng">
            <div className="modaldonhang">
                <div
                    style={{
                        display: 'grid',
                        gap: '5px',
                        alignItems: 'center',
                        gridTemplateColumns: '60% 40%'
                    }}
                >
                    {dataEdit?.id ? (
                        <div>{value.name}</div>
                    ) : (
                        <SelectComponent
                            data={lienhe}
                            value={value.name}
                            onChange={(e) => {
                                const find = lienhe.find((x) => x.id === e.value);
                                value.id = e?.id as string;
                                value.name = e?.name as string;
                                setValue((pre) => ({ ...pre }));
                            }}
                        ></SelectComponent>
                    )}
                    <InputNumber
                        value={value.sothung}
                        onChange={(e) => {
                            setValue((pre) => ({ ...pre, sothung: e.value }));
                        }}
                        placeholder="Số thùng.."
                    ></InputNumber>
                </div>
                {value.itemList.map((i, index) => {
                    return <ItemDonhang setValue={setValue} key={i.id + index} item={i}></ItemDonhang>;
                })}
            </div>
        </Dialog>
    );
};
const ItemDon = ({ item }: { item: donhangItem }) => {
    const imgRef = useRef();
    const fakeref = useRef<HTMLDivElement>();
    const [open, setOpen] = useState<donhangItem | null>();
    const { data } = useContext(dataContent);
    const [show, setShow] = useState(true);
    const { hangxuat } = donHangStore();
    const footerContent = (
        <div
            style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'end'
            }}
        >
            <ToggleButton height={30} checked={show} onLabel="Total ON" offLabel="Total OFF" onChange={(e) => setShow(e.value)} />
            <Button onClick={() => setOpen(item)} raised outlined size="small" security="" icon={<Image src={editsvg} alt="" height={20}></Image>}></Button>
            <Button
                raised
                outlined
                size="small"
                onClick={async () => {
                    const el = imgRef.current.querySelector('.p-card-body');
                    const footer = imgRef.current.querySelector('.p-card-footer');
                    footer.style.display = 'none';
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
                    footer.style.display = 'revert';
                }}
                icon={<Image src={downSvg} alt="" height={20}></Image>}
            ></Button>
            <Button
                onClick={() => {
                    confirmDialog({
                        message: 'Bạn có chắc muốn xóa đơn hàng này này',
                        header: 'Xác nhận!',
                        accept: () => {
                            loadingRef.current?.on();
                            item.delete = true;

                            updateData(db, data.id, { itemList: data.itemList.filter((x) => !x.delete) }, () => loadingRef.current?.off());
                        }
                    });
                }}
                raised
                outlined
                size="small"
                severity="danger"
                icon={<Image src={deletesvg} alt="" height={20}></Image>}
            ></Button>
        </div>
    );

    const totalOld = (a = 0) => {
        const index = hangxuat.findIndex((x) => x.id === data.id);
        let index1 = 0;
        let index2 = 0;
        for (let i = index + 1; i <= hangxuat.length; i++) {
            const find = hangxuat[i].itemList.find((x) => x.id === item.id);
            if (!find) continue;
            if (find?.endbill) break;
            a += find.itemList.reduce((a, b) => a + b.soluong * b.gia, 0);
            index2 = i;
        }
        if (!hangxuat[index].itemList.find((x) => x.id === item.id)?.endbill)
            for (let i = index - 1; i >= 0; i--) {
                const find = hangxuat[i].itemList.find((x) => x.id === item.id);
                if (!find) continue;
                a += find.itemList.reduce((a, b) => a + b.soluong * b.gia, 0);
                index1 = index1;
                if (find?.endbill) break;
            }
        return {
            total: a,
            index1: index1,
            index2: index2
        };
    };
    const total = totalOld();
    return (
        <Card ref={imgRef} title={item.name} subTitle={`Ngày âm: ${data.ten} - Ngày dương: ${moment(data.time).format('DD/MM/YYYY')}`} footer={footerContent} className="md:w-25rem">
            {open && <EditTable onClose={() => setOpen(null)} dataEdit={open}></EditTable>}
            <div className="ItemDon-content">
                <table>
                    {item.itemList.map((i) => {
                        return (
                            <tr key={i.id}>
                                <td>{i.ten}</td>
                                <td>{i.soluong}</td>
                                <td>x</td>
                                <td>{formatNumber(i.gia)}</td>
                                <td>=</td>
                                <td>{formatNumber(i.soluong * i.gia)}</td>
                            </tr>
                        );
                    })}
                </table>
                <div className="ItemDon-total">
                    <strong>Tổng</strong>
                    <strong>{formatNumber(item.itemList.reduce((a, b) => a + b.soluong * b.gia, 0))}</strong>
                    <div>Tổng mặt hàng:</div>
                    <div className="itemtotal">{item.itemList.length}</div>
                    <div>Số thùng:</div>
                    <div className="itemtotal">{item.sothung}</div>
                    {show && (
                        <>
                            <div>Nợ cũ {`(${hangxuat[total.index2].ten} - ${hangxuat[total.index1].ten})`}:</div>
                            <div className="itemtotal">{formatNumber(total.total)}</div>
                            <strong>Tổng cộng:</strong>
                            <strong className="itemtotal">{formatNumber(total.total + item.itemList.reduce((a, b) => a + b.soluong * b.gia, 0))}</strong>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};
export default function ChiTietDonHang() {
    const [data, setData] = useState<hangxuatType>();

    const { getHangxuatById } = donHangStore();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const id = params.get('id');
        getHangxuatById(id as string, setData);
    }, []);
    const [open, setOpen] = useState(false);
    return (
        <dataContent.Provider
            value={{
                data
            }}
        >
            {open && <EditTable onClose={() => setOpen(false)}></EditTable>}
            <div className="ChiTietDonHang">
                <div className="ChiTietDonHang-header">
                    <div>Chi tiết đơn hàng ngày {data?.ten}</div>
                    <Button onClick={() => setOpen(true)} label="Thêm đơn hàng"></Button>
                </div>
                <div className="ChiTietDonHang-body">
                    {data?.itemList.map((i) => {
                        return <ItemDon item={i} key={i.id}></ItemDon>;
                    })}
                </div>
            </div>
        </dataContent.Provider>
    );
}
