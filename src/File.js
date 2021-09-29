import React, { useEffect, useState } from 'react';

import styles from './styles.css';

import Coms from './utils/coms';

export default function File({ fileName }) {
    const [contents, setContents] = useState(null);
    useEffect(() => {
        Coms.send("getFile", { file: fileName }).then((results) => {
            setContents(results);
            //console.log(results);
        });
    }, []);
    
    const contentPage = contents ? [...contents.slice(0, 1000)] : [];

	return <FileContents contents={contents} />;
}