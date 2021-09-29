import React from 'react';
import classnames from 'classnames';

import styles from './styles.css';

import Coms from './utils/coms';

export default function FileContents({ contents, comparisons, selected, onSelect }) {
    const contentPage = contents ? [...contents.slice(0, 1000)] : [];
    
    const useComparisons = comparisons || [];
    const selectedIndexes = selected.map(({ index }) => index);

	return (<div className={styles.contentsOuter}>
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
                    
                    return (
                        <div
                            key={index}
                            className={classnames(
                                styles.number,
                                isDifferent && styles.different,
                                selectedIndexes.includes(index) && styles.selected,
                            )}
                            tooltip={`Dec: ${number}. bin: ${bin}`}
                            onClick={() => {
                                onSelect({
                                    index,
                                    number,
                                });
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