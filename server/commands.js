const fs = require('fs');

module.exports = {
	getFile: ({ file }) => {
        if (!fs.existsSync(file)) {
            return null;
        }
        
        const content = fs.readFileSync(file);
        return content;
	},
}