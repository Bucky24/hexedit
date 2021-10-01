import React, { useState } from 'react';

import styles from './styles.css';

import FileComparison from './FileComparison';
import Coms from './utils/coms';

export default function App() {
    const [selected, setSelected] = useState(null);
    const [files, setFiles] = useState([]);
    
	return (<div className={styles.appRoot}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: 'calc(100% - 200px)'}}>
                <FileComparison
                    selected={selected}
                    onSelect={(item) => {
                        setSelected(item);
                    }}
                    files={files}
                    onClose={(file) => {
                        const index = files.indexOf(file);
                        files.splice(index, 1);
                        setFiles([...files]);
                    }}
                />
            </div>
            <div style={{ height: 200, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <input type="button" value="Open File" onClick={() => {
                    Coms.send("getFileName").then((name) => {
                        files.push(name);
                        setFiles([...files]);
                    });
                }}/>
                <div style={{ display: 'flex', height: 'calc(100% - 21px)' }}>
                    {selected && selected.map((items, index) => {
                        let totalString = "";
                        for (const item of items) {
                            const bin = item.number.toString(2).padStart(8, '0');
                            totalString += bin;
                        }

                        return (
                            <div style={{ width: `${100 / selected.length}%`, overflowY: 'auto', flexShrink: 1 }} key={`selected_${index}`}>
                                <div style={{ wordBreak: 'break-all' }}>{totalString}</div>
                                {items.map(({ number }, index) => {
                                    const hex = number.toString(16).padStart(2, '0');
                                    const bin = number.toString(2).padStart(8, '0');
                                    
                                    const char1 = bin.substr(0, 8);
                                    const charNum1 = parseInt(char1, 2);
                                    const char = String.fromCharCode(charNum1);
                                    return <div key={index}>
                                    0x{hex}: {number}, {bin}, &quot;{char}&quot;
                                    </div>
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
	</div>);
}