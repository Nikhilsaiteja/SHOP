const {JSDOM} = require('jsdom');
const createDOMPurify = require('dompurify');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const validator = require('validator');

const dbgr = require('debug')('app:sanitizer');

class Sanitizer{

    static sanitizeText(text){
        let cleanText = DOMPurify.sanitize(text,
            {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: []
            }
        )
        dbgr('sanitixed text:', cleanText);
        return cleanText;
    }

    static sanitizeEmail(email){
        let cleanEmail = DOMPurify.sanitize.toLowerCase(email,
            {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: []
            }
        )
        cleanEmail = validator.isEmail(cleanEmail) ? cleanEmail : '';
        dbgr('sanitized email:', cleanEmail);
        return cleanEmail;
    }

    static sanitizeFileName(fileName){
        let cleanFileName = DOMPurify.sanitize(fileName,
            {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: []
            }
        )
        cleanFileName = cleanFileName.replace(/[^a-zA-Z0-9.\-_]/g, '');
        dbgr('sanitized fileName:', cleanFileName);
        return cleanFileName;
    }

    static sanitizeNumber(number){
        let cleanNumber = DOMPurify.sanitize(number,
            {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: []
            }
        )
        cleanNumber = validator.isNumeric(cleanNumber) ? cleanNumber : '';
        dbgr('sanitized number:', cleanNumber);
        return cleanNumber;
    }

    static sanitizeObject(obj){
        let cleanObj = {};

        for(let key in obj){
            if(key.toLocaleLowerCase().includes('email')){
                cleanObj[key] = Sanitizer.sanitizeEmail(obj[key]);
            }
            else if(Array.isArray(obj[key])){
                cleanObj[key] = obj[key].map(item => Sanitizer.sanitizeObject(item));
            }
            else if(key.toLocaleLowerCase().includes('file') || key.toLocaleLowerCase().includes('image')){
                cleanObj[key] = Sanitizer.sanitizeFileName(obj[key]);
            }
            else if(key.toLocaleLowerCase().includes('number') || key.toLocaleLowerCase().includes('age')){
                cleanObj[key] = Sanitizer.sanitizeNumber(obj[key]);
            }
            else{
                cleanObj[key] = Sanitizer.sanitizeText(obj[key]);
            }
            dbgr(`sanitized object key: ${key}, value: ${cleanObj[key]}`);
            return cleanObj;
        }
    }

}

module.exports = new Sanitizer();