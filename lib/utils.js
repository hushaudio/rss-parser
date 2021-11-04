const entities = require('entities');
const xml2js = require('xml2js');

const DEFAULT_ENCODING = 'utf8';
const ENCODING_REGEX = /(encoding|charset)\s*=\s*(\S+)/;
const SUPPORTED_ENCODINGS = ['ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'latin1', 'binary', 'hex'];
const ENCODING_ALIASES = {
  'utf-8': 'utf8',
  'iso-8859-1': 'latin1',
}

module.exports = (options) => {
  return {
    stripHtml: function(str) {
      str = str.replace(/([^\n])<\/?(h|br|p|ul|ol|li|blockquote|section|table|tr|div)(?:.|\n)*?>([^\n])/gm, '$1\n$3')
      str = str.replace(/<(?:.|\n)*?>/gm, '');
      return str;
    },
    
    getSnippet: function(str) {
      return entities.decodeHTML(stripHtml(str)).trim();
    },
    
    getLink: function(links, rel, fallbackIdx) {
      const _attrKey = options?.xml2js?.attrkey

      if (!links) return;
      for (let i = 0; i < links.length; ++i) {
        if (links[i][_attrKey].rel === rel) return links[i][_attrKey].href;
      }
      if (links[fallbackIdx]) return links[fallbackIdx][_attrKey].href;
    },
    
    getContent: function(content) {
      if (typeof content._ === 'string') {
        return content._;
      } else if (typeof content === 'object') {
        let builder = new xml2js.Builder({headless: true, explicitRoot: true, rootName: 'div', renderOpts: {pretty: false}});
        return builder.buildObject(content);
      } else {
        return content;
      }
    },
    
    copyFromXML: function(xml, dest, fields) {
      fields.forEach(function(f) {
        let from = f;
        let to = f;
        let options = {};
        if (Array.isArray(f)) {
          from = f[0];
          to = f[1];
          if (f.length > 2) {
            options = f[2];
          }
        }
        const { keepArray, includeSnippet } = options;
        if (xml[from] !== undefined){
          dest[to] = keepArray ? xml[from] : xml[from][0];
        }
        if (dest[to] && typeof dest[to]._ === 'string') {
          dest[to]=dest[to]._;
        }
        if (includeSnippet && dest[to] && typeof dest[to] === 'string') {
          dest[to + 'Snippet'] = getSnippet(dest[to]);
        }
      })
    },
    
    maybePromisify: function(callback, promise) {
      if (!callback) return promise;
      return promise.then(
        data => setTimeout(() => callback(null, data)),
        err => setTimeout(() => callback(err))
      );
    },
    
    getEncodingFromContentType: function(contentType) {
      contentType = contentType || '';
      let match = contentType.match(ENCODING_REGEX);
      let encoding = (match || [])[2] || '';
      encoding = encoding.toLowerCase();
      encoding = ENCODING_ALIASES[encoding] || encoding;
      if (!encoding || SUPPORTED_ENCODINGS.indexOf(encoding) === -1) {
        encoding = DEFAULT_ENCODING;
      }
      return encoding;
    }
    
  }
};