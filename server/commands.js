const fs = require('fs');
const {dialog} = require('electron');

module.exports = {
	getFile: ({ file }) => {
        if (!fs.existsSync(file)) {
            return null;
        }
        
        const content = fs.readFileSync(file);
        return content;
	},
    getFileName: async () => {
        const response = await dialog.showOpenDialog({properties: ['openFile'] })
        if (!response.canceled) {
            // handle fully qualified file name
            return response.filePaths[0];
        } else {
            return null;
        }
    }
}