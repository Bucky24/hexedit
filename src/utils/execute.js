import { v4 as uuidv4 } from 'uuid';

// expects code to have a return value
export async function executeMethodPromise(code, data) {
    const id = uuidv4().replace(/-/g, "");
    
    if (!window.__execData) {
        window.__execData = {};
    }
    
    window.__execData[id] = {
        promise: null, 
        result: null,
        data,
    };
    
    const functionName = "func_" + id;
    
    const finalCode = `const ${functionName} = async (inputs) => { ${code} };
    window.__execData['${id}'].promise = ${functionName}(window.__execData['${id}'].data);
    `
    
    //console.log(finalCode);
    
    eval(finalCode);
    
    const result = await window.__execData[id].promise;
    return result;
}

export function executeMethod(code, data) {
    const id = uuidv4().replace(/-/g, "");
    
    if (!window.__execData) {
        window.__execData = {};
    }
    
    window.__execData[id] = {
        result: null,
        promise: null,
        data,
    };
    
    const functionName = "func_" + id;
    
    const finalCode = `const ${functionName} = (inputs) => { ${code} };
    window.__execData['${id}'].result = ${functionName}(window.__execData['${id}'].data);
    `
    
    //console.log(finalCode);
    
    eval(finalCode);
    
    const result = window.__execData[id].result;
    return result;
}

const methodIds = {};

export function buildMethod(code) {
    const id = uuidv4();
    
    if (!window.__execData) {
        window.__execData = {};
    }
    
    window.__execData[id] = {
        method: null,
    };
    
    const finalCode = `window.__execData['${id}'].method = (inputs) => { ${code} };`;
    eval(finalCode);
    //console.log('setting ', id, 'to', window.__execData[id]);
    methodIds[id] = window.__execData[id].method;
    
    return id;
}

export function runMethod(id, data) {
    if (!methodIds[id]) {
        throw new Error("no such method for id " + id);
    }
    
    return methodIds[id](data);
}