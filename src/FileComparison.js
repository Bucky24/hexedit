import React, { useEffect, useState, useRef } from 'react';

import styles from './styles.css';

import Coms from './utils/coms';
import FileContents from './FileContents';
import { buildMethod, runMethod } from './utils/execute';

export default function FileComparison({ files, selected, onSelect, onClose, processor }) {
    const [data, setData] = useState([]);
    const [comparisons, setComparisons] = useState([]);
    const [hovered, setHovered] = useState(-1);
    const processorRef = useRef(processor);
    const [processing, setProcessing] = useState(false);
    
    const processFiles = () => {
        if (processing) {
            return;
        }
        const processor = processorRef.current;
        //console.log('processing with', processor);
        if (!processor) {
            for (const fileItem of data) {
                fileItem.processed = [];
            }
            return;
        }
        const methodId = buildMethod(processor);
        
        for (const fileItem of data) {
            if (!fileItem) {
                continue;
            }
            //console.log('checking', fileItem.file);
            const fileData = fileItem.data;
            const result = runMethod(methodId, { data: fileData });
            //console.log(result);
            fileItem.processed = result;
        }
    };

    const loadFile = (file, index, name) => {
        return Coms.send("getFile", { file }).then((results) => {
            setData((data) => {
                const newData = [...data];
                newData[index] = {
                    data: results,
                    name,
                    file,
                    processed: [],
                };
                //console.log(newData);
                return newData;
            });
        });
    };
    
    useEffect(() => {
        processorRef.current = processor;
        processFiles();
    }, [processor, processing]);
    
    useEffect(() => {
        const nullArr = [];
        const emptyArr = [];
        for (let i=0;i<files.length;i++) {
            nullArr.push(null);
            emptyArr.push([]);
        }
        setData(nullArr);
        setProcessing(true);
        
        const promises = [];
        
        files.forEach((file, index) => {
            if (!file) {
                return;
            }
            const files = file.split(/[\/\\]/);
            const name = files[files.length-1];

            const promise = loadFile(file, index, name);
            promises.push(promise);
        });
        onSelect(emptyArr);
        Promise.all(promises).then(() => {
            setProcessing(false);
        });
    }, [files]);
    
    useEffect(() => {
        // compare
        const newComparisons = [];
        
        let maxWidth = 5000;
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
                            hoverCell={hovered}
                            enterCell={(cell) => {
                                setHovered(cell);
                            }}
                            processed={bin.processed}
                            onReload={() => {
                                loadFile(bin.file, index, bin.name);
                            }}
                        />
                    </div>
                );
            })}
        </div>
    )
}