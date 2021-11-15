const fs = require('fs');
const { dialog, app } = require('electron');
const path = require('path');

module.exports = {
	getFile: ({ file, text }) => {
        if (!fs.existsSync(file)) {
            return null;
        }
        
        if (text) {
            const content = fs.readFileSync(file, 'utf8');
            return content;
        } else {
            const content = fs.readFileSync(file);
            return content;
        }
	},
    getFileName: async () => {
        const response = await dialog.showOpenDialog({properties: ['openFile'] })
        if (!response.canceled) {
            // handle fully qualified file name
            return response.filePaths[0];
        } else {
            return null;
        }
    },
    getPrefs: () => {
        const dir = app.getPath('userData');
        const prefPath = path.join(dir, "prefs.json");
        
        if (!fs.existsSync(prefPath)) {
            return {};
        }
        
        const prefStr = fs.readFileSync(prefPath, 'utf8');
        const prefs = JSON.parse(prefStr);
        
        return prefs;
    },
    setPrefs: (prefs) => {
        const dir = app.getPath('userData');
        const prefPath = path.join(dir, "prefs.json");
        
        const prefsString = JSON.stringify(prefs);
        fs.writeFileSync(prefPath, prefsString);
        console.log("Wrote to ", prefPath);
    },
}