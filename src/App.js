import React, { useState } from 'react';

import styles from './styles.css';

import FileComparison from './FileComparison';

export default function App() {
    const [selected, setSelected] = useState(null);
    
	return (<div className={styles.appRoot}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: 'calc(100% - 200px)'}}>
                <FileComparison
                    selected={selected}
                    onSelect={(item) => {
                        setSelected(item);
                    }}
                    files={[
                        "/Users/rwijtman/Downloads/rec_grass.aoe2record",
                        "/Users/rwijtman/Downloads/rec_somebeach.aoe2record",
                    ]}
                />
            </div>
            <div style={{ height: 200, flexShrink: 0 }}>
                {selected && selected.map((items) => {
                    return (
                        <div>
                            {items.map(({ number }) => {
                                const hex = number.toString(16).padStart(2, '0');
                                const bin = number.toString(2).padStart(8, '0');
                                
                                const char1 = bin.substr(0, 8);
                                const charNum1 = parseInt(char1, 2);
                                const char = String.fromCharCode(charNum1);
                                return <div>
                                0x{hex}: {number}, {bin}, &quot;{char}&quot;
                                </div>
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
	</div>);
}