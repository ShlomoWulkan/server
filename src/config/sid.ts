import fs from 'fs';

const sid = async () => { 
    try {
        const path = './server/src/data/globalterrorismdb_0718dist.json';
        const Data = fs.readFileSync(path, 'utf-8');
        const parseData = JSON.parse(Data); 
        
        
    } catch (error) {
        
    }
}