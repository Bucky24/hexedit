import React, { useEffect, useState } from 'react';


import styles from './styles.css';

import Coms from './utils/coms';
import FileContents from './FileContents';

export default function FileComparison({ files, selected, onSelect, onClose }) {
    const [data, setData] = useState([]);
    const [comparisons, setComparisons] = useState([]);
    
    useEffect(() => {
        const nullArr = [];
        const emptyArr = [];
        for (let i=0;i<files.length;i++) {
            nullArr.push(null);
            emptyArr.push([]);
        }
        setData(nullArr);
        
        files.forEach((file, index) => {
            const files = file.split(/[\/\\]/);
            const name = files[files.length-1];

            Coms.send("getFile", { file }).then((results) => {
                setData((data) => {
                    const newData = [...data];
                    newData[index] = {
                        data: results,
                        name,
                        file,
                    };
                    console.log(newData);
                    return newData;
                });
            });
        });
        onSelect(emptyArr);
    }, [files]);
    
    useEffect(() => {
        // compare
        const newComparisons = [];
        
        let maxWidth = 1000;
        for (let i=0;i<data.length;i++) {
            maxWidth = Math.min(maxWidth, data[i]?.length ?? 0);
        }
        
        for (let i=0;i<maxWidth;i++) {
            let curElem = null;
            for (let j=0;j<data.length;j++) {
                //console.log(j, i, bin);
                const bin = data[j];
                const elem = bin[i];
                if (curElem === null) {
                    curElem = elem;
                } else {
                    if (curElem !== elem) {
                        newComparisons.push(i);
                        break;
                    }
                }
            }
        }
        
        setComparisons(newComparisons);
    }, [data]);
    
    return (
        <div className={styles.comparisonOuter}>
            {data.map((bin, index) => {
                if (!bin) {
                    return null;
                }
                return (
                    <div className={styles.comparisonFile} key={index} style={{ width: 100/data.length }}>
                        <FileContents
                            contents={bin.data}
                            name={bin.name}
                            comparisons={comparisons}
                            selected={selected[index] || []}
                            onSelect={(item) => {
                                const newSelected = [...selected];
                                const newItems = [...newSelected[index]];
                                const itemIndex = newItems.findIndex((elem) => elem.index === item.index);
                                if (itemIndex >= 0) {
                                    newItems.splice(itemIndex, 1);
                                } else {
                                    newItems.push(item);
                                }
                                newSelected[index] = newItems;
                                
                                onSelect(newSelected);
                            }}
                            onClose={() => {
                                if (onClose) {
                                    onClose(bin.file);
                                }
                            }}
                        />
                    </div>
                );
            })}
        </div>
    )
}