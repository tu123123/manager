import { ActionSheet, Input } from 'antd-mobile';
import { Button } from 'primereact/button';
import { useState } from 'react';
import './index.scss';
export const SelectComponent = ({ data, onChange, value, label }: { label?: string; data: any; onChange: (e: any) => void; value: string }) => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button outlined={!value ? true : false} style={{ width: '100%' }} onClick={() => setOpen(true)} label={value || 'Chọn...'}></Button>
            {open && (
                <ActionSheet
                    style={{
                        zIndex: 200000
                    }}
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
                        onChange(e);
                    }}
                    visible
                    actions={data.filter((i) => i[label || 'name'].toLowerCase().includes(search?.toLowerCase())).map((i) => ({ ...i, key: i.id, text: i[label || 'name'] }))}
                ></ActionSheet>
            )}
        </>
    );
};
