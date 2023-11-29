import React from 'react';
import classnames from 'classnames';

import styles from './styles.css';

import Coms from './utils/coms';

export default function FileContents({ contents, comparisons, selected, onSelect, name, onClose, enterCell, hoverCell, leaveCell, processed, onReload }) {
    const contentPage = contents ? [...contents.slice(0, 1000)] : [];
    
    const useComparisons = comparisons || [];
    const selectedIndexes = selected.map(({ index }) => index);

	return (<div className={styles.contentsOuter}>
        <div>
            <div>Name: {name}</div>
            <input
                type="button"
                value="Close"
                onClick={onClose}
            />
            <input
                type="button"
                value="Reload"
                onClick={onReload}
            />
        </div>
		{!contents && (
		    <div>
                No contents yet
            </div>
		)}
        {contents && (
            <div className={styles.contentOuter}>
                {contentPage.map((number, index) => {
                    const hex = number.toString(16).padStart(2, '0');
                    const bin = number.toString(2).padStart(8, '0');
                    
                    const isDifferent = useComparisons.includes(index);
                    
                    const matchingProcess = processed.find((item) => {
                        if (index < 10) {
                            //console.log(item.startIndex, item.endIndex, index, index >= item.startIndex, index <= item.endIndex);
                        }
                        return index >= item.startIndex && index <= item.endIndex;
                    });

                    if (index < 10) {
                        //console.log(processed, matchingProcess, index);
                    }
                    
                    return (
                        <div
                            key={index}
                            className={classnames(
                                styles.number,
                                isDifferent && styles.different,
                                selectedIndexes.includes(index) && styles.selected,
                                index === hoverCell && styles.hovered,
                            )}
                            style={{
                                backgroundColor: matchingProcess?.color,
                            }}
                            tooltip={`Dec: ${number}. bin: ${bin}`}
                            onClick={() => {
                                onSelect({
                                    index,
                                    number,
                                });
                            }}
                            onMouseEnter={() => {
                                if (enterCell) {
                                    enterCell(index);
                                }
                            }}
                            onMouseLeave={() => {
                                if (leaveCell) {
                                    leaveCell(index);
                                }
                            }}
                        >
                            0x{hex}
                        </div>
                    );
                })}
            </div>
        )}
	</div>);
}