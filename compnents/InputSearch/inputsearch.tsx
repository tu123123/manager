import { SearchBar, List } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { mathangStore } from '@/store/mathangStore';
export default function InputSearch({ onChange, onChangeSelect, value }: { onChange: (e) => void; value: string; onChangeSelect: (e) => void }) {
    const { getMatHang, dsMathang } = mathangStore();

    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleSearch = (val: string) => {
        onChange(val);
        if (val.trim()) {
            setSuggestions(dsMathang.filter((opt) => opt.ten?.toLowerCase().includes(val.toLowerCase())));
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (opt) => {
        onChangeSelect(opt);
        setSuggestions([]);
    };
    useEffect(() => {
        getMatHang();
    }, []);
    return (
        <div style={{ position: 'relative' }}>
            <SearchBar placeholder="Nhập để tìm..." value={value} onChange={handleSearch} />
            {suggestions.length > 0 && (
                <List
                    style={{
                        position: 'absolute',
                        top: '35px',
                        left: 0,
                        right: 0,
                        overflow: 'auto',
                        maxHeight: '50dvh',
                        background: '#ffffff',
                        border: '1px solid #b6b6b6',
                        zIndex: 1000
                    }}
                >
                    {suggestions.map((s, i) => (
                        <List.Item key={i} onClick={() => handleSelect(s)}>
                            {s.ten}
                        </List.Item>
                    ))}
                </List>
            )}
        </div>
    );
}
