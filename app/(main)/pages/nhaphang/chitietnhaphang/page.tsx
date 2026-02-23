'use client';
import { Card } from 'primereact/card';
import '../donhang.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import deletesvg from '@/compnents/assets/delete.svg';
import editsvg from '@/compnents/assets/edit.svg';
import detailsvg from '@/compnents/assets/detail.svg';
import { useEffect, useRef, useState } from 'react';
import downSvg from '@/compnents/assets/download.svg';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { addData, delData, getData2, updateData } from '@/compnents/config';
import { loadingRef } from '@/layout/AppConfig';
import { danhsachphieuType, hangnhapStore, phieunhapItemtype, phieunhaptype } from '@/store/hangnhapStore';
import moment from 'moment';
import Image from 'next/image';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { lienheStore } from '@/store/lienheStore';
import { formatNumber } from '@/compnents/e2e';
import { uuid } from 'uuidv4';
import { toPng } from 'html-to-image';
import { donhangItem } from '@/store/donhangStore';
import { Capacitor } from '@capacitor/core';
import { SelectComponent } from '@/compnents/InputSearch/selectComponent';
const dbPhieunhap = 'phieunhap';
const dbDanhsachphieunhap = 'danhsachphieunhap';
const ItemPhieunhap = ({ item, onSetdata, onDelete }: { onDelete: () => void; item: phieunhapItemtype; onSetdata: () => void }) => {
    return (
        <tr>
            <td>
                <InputText
                    value={item.ten}
                    onChange={(e) => {
                        item.ten = e.target.value;
                        onSetdata();
                    }}
                    autoFocus
                ></InputText>
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
                            message: 'Bạn có chắc muốn xóa đơn hàng này này',
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
const ModalAddphieunhap = ({ onClose, dataEdit }: { onClose: () => void; dataEdit?: danhsachphieuType }) => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const [value, setValue] = useState<danhsachphieuType>(
        dataEdit?.id
            ? JSON.parse(JSON.stringify(dataEdit))
            : {
                  tenDoiTac: '',
                  idDoitac: '',
                  group: id as string,

                  itemList: []
              }
    );
    const { lienhe } = lienheStore();
    const emtryItem = {
        soluong: 0,
        gia: 0,
        ten: ''
    };
    const footer = (
        <>
            <Button
                onClick={() => {
                    setValue((pre) => ({
                        ...pre,
                        itemList: [...pre.itemList, { ...emtryItem, id: uuid() }]
                    }));
                }}
                label="Thêm dòng"
            ></Button>
            <Button
                onClick={() => {
                    loadingRef.current?.on();
                    if (dataEdit?.id)
                        return updateData(
                            dbDanhsachphieunhap,
                            value.id,
                            value,
                            () => {
                                onClose();
                                loadingRef.current?.off();
                            },
                            () => {
                                loadingRef.current?.off();
                            }
                        );
                    addData(
                        dbDanhsachphieunhap,
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
    useEffect(() => {}, []);
    return (
        <Dialog onHide={onClose} header="Chỉnh sửa phiếu" footer={footer} visible>
            <div className="editphieu"></div>
            <label>
                <SelectComponent
                    data={lienhe}
                    value={value.tenDoiTac}
                    onChange={(e) => {
                        console.log(e);
                        setValue((pre) => ({
                            ...pre,
                            tenDoiTac: e.name,
                            idDoitac: e.id as string
                        }));
                    }}
                ></SelectComponent>
                {/* <div>Tên đối tác</div>
                <Dropdown
                    filter
                    value={value.idDoitac}
                    options={lienhe}
                    onChange={(e) => {
                        setValue((pre) => ({
                            ...pre,
                            tenDoiTac: lienhe.find((x) => x.id === e.value)?.name as string,
                            idDoitac: e.value as string
                        }));
                    }}
                    optionLabel="name"
                    optionValue="id"
                ></Dropdown> */}
            </label>
            <div className="danhsachphieu">
                <div className="ItemPhieunhap">
                    <div className="item-phieu">
                        <table>
                            {value.itemList.map((i) => {
                                return (
                                    <ItemPhieunhap
                                        item={i}
                                        onDelete={() => {
                                            setValue((pre) => ({ ...pre, itemList: pre.itemList.filter((x) => !x.delete) }));
                                        }}
                                        onSetdata={() => setValue((pre) => ({ ...pre }))}
                                        key={i.id}
                                    ></ItemPhieunhap>
                                );
                            })}
                        </table>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};
const ItemDonhang = ({ item, setOpen }: { item: danhsachphieuType; setOpen: () => void }) => {
    const imgRef = useRef();
    const footerContent = () => {
        return (
            <div
                style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'end'
                }}
            >
                <Button onClick={setOpen} raised outlined size="small" security="" icon={<Image src={editsvg} alt="" height={20}></Image>}></Button>
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

                                delData(dbDanhsachphieunhap, item.id, () => loadingRef.current?.off());
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
    };
    return (
        <Card ref={imgRef} key={item.id} title={item.tenDoiTac} footer={<>{footerContent()}</>}>
            <table
                style={{
                    width: '100%'
                }}
            >
                {item.itemList.map((i) => {
                    return (
                        <tr key={i.id}>
                            <td>{i.ten}</td>
                            <td>:</td>
                            <td>{i.soluong}</td>
                            <td>x</td>
                            <td>{formatNumber(i.gia)}</td>
                            <td>=</td>
                            <td>{formatNumber(i.soluong * i.gia)}</td>
                        </tr>
                    );
                })}
            </table>
            <div className="footerTable">
                <strong>Tổng: {formatNumber(item.itemList.reduce((a, b) => a + b.gia * b.soluong, 0))}</strong>
            </div>
        </Card>
    );
};
export default function Chitietnhaphang() {
    const [open, setOpen] = useState(false);
    const { phieunhap, getPhieunhap, getDanhSachPhieunhap, danhsachPhieu } = hangnhapStore();
    const { getLienhe } = lienheStore();

    useEffect(() => {
        getDanhSachPhieunhap();
        getLienhe();
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
                <h4>Chi tiết phiếu nhập</h4>
                <Button onClick={() => setOpen(true)} label="Thêm phiếu"></Button>
            </div>
            <div className="chitietphieunhap-body">
                {danhsachPhieu
                    .filter((x) => x.group === new URLSearchParams(window.location.search).get('id'))
                    .map((x) => {
                        return <ItemDonhang item={x} setOpen={() => setOpen(x)} key={x.id}></ItemDonhang>;
                    })}
            </div>
        </div>
    );
}
