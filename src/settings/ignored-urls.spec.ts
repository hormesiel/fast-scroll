import {
  urlMatchesAnyGlobOf
} from './ignored-urls';

describe('urlMatchesAnyGlobOf()', () => {
  const excludedWebsites = [
    // top level domain + all subdomains + all pages
    'example.com',

    // top level domain but not subdomains
    'https://example2.com',

    // top level domain but not subdomains except "www"
    'https://(www.)?example3.com',

    // one subdomain only
    'https://api.example4.com',

    // one page only
    'https://example5.com/foo/bar/baz.html',

    // whole directory / path
    'https://example6.com/foo*',
    // OR 'https://example6.com/foo/**',
  ];

  it('top level domain + all subdomains + all pages', () => {
    expect(urlMatchesAnyGlobOf('https://example.com', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example.com/', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example.com/foo', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example.com/foo/bar/baz.html', excludedWebsites)).toBe(true);

    expect(urlMatchesAnyGlobOf('https://api.example.com', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://api.example.com/', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://api.example.com/foo', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://api.example.com/foo/bar/baz.html', excludedWebsites)).toBe(true);

    expect(urlMatchesAnyGlobOf('https://docs.api.example.com', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://docs.api.example.com/', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://docs.api.example.com/foo', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://docs.api.example.com/foo/bar/baz.html', excludedWebsites)).toBe(true);

    expect(urlMatchesAnyGlobOf('https://www.example.com', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://www.example.com/', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://www.example.com/foo', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://www.example.com/foo/bar/baz.html', excludedWebsites)).toBe(true);
  });

  it('top level domain but not subdomains', () => {
    expect(urlMatchesAnyGlobOf('https://example2.com', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example2.com/', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example2.com/foo', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example2.com/foo/bar/baz.html', excludedWebsites)).toBe(true);

    expect(urlMatchesAnyGlobOf('https://api.example2.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example2.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example2.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example2.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://docs.api.example2.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example2.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example2.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example2.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://www.example2.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example2.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example2.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example2.com/foo/bar/baz.html', excludedWebsites)).toBe(false);
  });

  it('top level domain but not subdomains except "www"', () => {
    expect(urlMatchesAnyGlobOf('https://example3.com', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example3.com/', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example3.com/foo', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example3.com/foo/bar/baz.html', excludedWebsites)).toBe(true);

    expect(urlMatchesAnyGlobOf('https://api.example3.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example3.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example3.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example3.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://docs.api.example3.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example3.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example3.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example3.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://www.example3.com', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://www.example3.com/', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://www.example3.com/foo', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://www.example3.com/foo/bar/baz.html', excludedWebsites)).toBe(true);
  });

  it('one subdomain only', () => {
    expect(urlMatchesAnyGlobOf('https://example4.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://example4.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://example4.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://example4.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://api.example4.com', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://api.example4.com/', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://api.example4.com/foo', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://api.example4.com/foo/bar/baz.html', excludedWebsites)).toBe(true);

    expect(urlMatchesAnyGlobOf('https://docs.api.example4.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example4.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example4.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example4.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://www.example4.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example4.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example4.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example4.com/foo/bar/baz.html', excludedWebsites)).toBe(false);
  });

  it('one page only', () => {
    expect(urlMatchesAnyGlobOf('https://example5.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://example5.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://example5.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://example5.com/foo/bar/baz.html', excludedWebsites)).toBe(true);

    expect(urlMatchesAnyGlobOf('https://api.example5.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example5.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example5.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example5.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://docs.api.example5.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example5.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example5.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example5.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://www.example5.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example5.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example5.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example5.com/foo/bar/baz.html', excludedWebsites)).toBe(false);
  });

  it('whole directory / path', () => {
    expect(urlMatchesAnyGlobOf('https://example6.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://example6.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://example6.com/foo', excludedWebsites)).toBe(true);
    expect(urlMatchesAnyGlobOf('https://example6.com/foo/bar/baz.html', excludedWebsites)).toBe(true);

    expect(urlMatchesAnyGlobOf('https://api.example6.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example6.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example6.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://api.example6.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://docs.api.example6.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example6.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example6.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://docs.api.example6.com/foo/bar/baz.html', excludedWebsites)).toBe(false);

    expect(urlMatchesAnyGlobOf('https://www.example6.com', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example6.com/', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example6.com/foo', excludedWebsites)).toBe(false);
    expect(urlMatchesAnyGlobOf('https://www.example6.com/foo/bar/baz.html', excludedWebsites)).toBe(false);
  });
});
