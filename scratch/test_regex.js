const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p><w:r><w:t>Hello World</w:t></w:r></w:p>
        <w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr>
    </w:body>
</w:document>`;

let docXml = xml;
docXml = docXml.replace('<w:body>', '<w:body><w:p><w:r><w:t>{#items}</w:t></w:r></w:p>');
docXml = docXml.replace(/(<w:sectPr[^>]*>[\s\S]*?<\/w:sectPr>\s*)?<\/w:body>/, (match) => {
    return `<w:p><w:r><w:t>{@pageBreak}</w:t></w:r></w:p><w:p><w:r><w:t>{/items}</w:t></w:r></w:p>` + match;
});

console.log(docXml);
