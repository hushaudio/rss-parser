# RSS Parser

[![npm version](https://img.shields.io/npm/v/rss-parser.svg)][npm-link]
[![npm downloads](https://img.shields.io/npm/dm/rss-parser.svg)][npm-link]

[npm-link]: https://www.npmjs.com/package/@ohshutit/rss-parser

RSS Parser is an advanced library designed to convert RSS XML feeds into JavaScript objects efficiently. This project is a refined fork of the original work found at [https://github.com/rbren/rss-parser](https://github.com/rbren/rss-parser), featuring enhancements and extended capabilities.

## Installation

To integrate RSS Parser into your project, execute the following command:

```bash
npm install --save @ohshutit/rss-parser
```

## Usage Overview

RSS Parser offers flexibility by allowing RSS feeds to be parsed from URLs (`parser.parseURL`) or directly from XML strings (`parser.parseString`). It supports both callback and Promise-based workflows, catering to a variety of development preferences.

### In Node.js

Here is a Node.js example demonstrating asynchronous usage with Promises:

```javascript
const Parser = require('@ohshutit/rss-parser');
let parser = new Parser();

(async () => {
  let feed = await parser.parseURL('https://www.reddit.com/.rss');
  console.log(feed.title);
  feed.items.forEach(item => {
    console.log(`${item.title}: ${item.link}`);
  });
})();
```

### Using TypeScript

For TypeScript users, type definitions can be applied to enhance development experience:

```typescript
import Parser, { IFeed, IItem } from '@ohshutit/rss-parser';

interface CustomFeed extends IFeed {
  foo: string;
}
interface CustomItem extends IItem {
  bar: number;
}

const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    feed: ['foo'],
    item: ['bar']
  }
});

(async () => {
  const feed = await parser.parseURL('https://www.reddit.com/.rss');
  console.log(feed.foo); // Accessing custom field
  feed.items.forEach(item => {
    console.log(`${item.title}: ${item.link}`);
  });
})();
```

### In the Browser

For browser environments, consider using a module bundler like webpack. We also offer pre-built distributions for direct usage, but remember to include a Promise polyfill for compatibility.

```html
<script src="/node_modules/@ohshutit/rss-parser/dist/rss-parser.min.js"></script>
<script>
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

let parser = new RSSParser();
parser.parseURL(CORS_PROXY + 'https://www.reddit.com/.rss', function(err, feed) {
  if (err) throw err;
  console.log(feed.title);
  feed.items.forEach(entry => {
    console.log(`${entry.title}: ${entry.link}`);
  });
});
</script>
```

### Migration Guide: v2 to v3

Transitioning from version 2 to version 3 involves several minor adjustments:

- Instantiate `Parser` before using `parseString` or `parseURL`.
- `parseFile` method has been removed to improve browser support.
- Configuration options are now provided through the `Parser` constructor.
- The structure of the parsed output has been simplified for direct access.

## Output Specification

Explore the complete format of parsed RSS feeds in our [sample output](test/output/reddit.json).

## Advanced Configuration

### Custom Fields

Extend parsing capabilities with `customFields` to include unique or additional feed and item properties.

### XML and HTTP Options

Leverage `xml2js` options for XML parsing customization and configure HTTP request details, including timeout, headers, and redirects, to fit your application's needs.

## Contributing

We encourage contributions! If you're adding a feature or fixing a bug, please include a test case. Follow the guidelines for running tests and publishing releases to ensure quality and consistency.

### Testing and Release Process

- Test your changes with `npm test`. If output files are affected, verify and update them as needed.
- Publish releases with a clear process, ensuring changes are built and documented correctly.

For a detailed guide on contributing, running tests, and publishing, refer to the project's GitHub repository.

Join us in enhancing RSS Parser to meet the evolving needs of developers and applications worldwide.
